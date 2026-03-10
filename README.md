### Overview

A data collection and analysis toolkit for the online Game of Thrones board game. The end goal is a real-time strategic assistant powered by a RAG (Retrieval-Augmented Generation) pipeline: historical game situations are embedded into a vector store, and at inference time the LLM retrieves the most similar past situations — with their outcomes — to reason over and produce recommendations.

---

### Goals

Wreck everyone in Game of Thrones through well-informed stats, strategy, and LLM analysis :)

The assistant will:
1. **Predict opponent actions** — retrieve similar past situations where opponents faced the same conditions and surface what they bid / played
2. **Recommend your own actions** — suggest optimal bids and orders by grounding the LLM in retrieved historical precedents with known outcomes
3. **Evaluate action quality** — score a proposed action by comparing it against retrieved strong/weak plays in analogous positions
4. **Explain reasoning** — produce a concise natural-language summary grounded in specific retrieved examples, not just abstract patterns

---

### High-level Process

**Phase 1: Data Collection (in progress)**

The injection script hooks into the game client's `onMessage` deserialization pipeline via Tampermonkey and captures game events as they happen. Data is downloaded as JSON at the end of each game.

Target: ~1,000 games across multiple players. The scraper is already built — this is purely a data collection problem.

**Phase 2: Feature Extraction & Embedding**

Convert raw game JSON into structured game-state feature vectors for each decision point (bids, combats). Each vector captures full board context at the moment of the decision.

These vectors are embedded (via a text or numeric embedding model) and stored in a vector database alongside the decision taken and its eventual outcome (win/loss, rank, delta). This is the retrieval corpus.

**Phase 3: RAG Inference Layer**

At inference time, the current game state is embedded and used to query the vector store for the K most similar historical situations. The retrieved examples — state, action taken, and outcome — are passed to the LLM as context.

The LLM reasons over these grounded examples to produce a recommendation: what to bid, which card to play, and why.

**Phase 4: Assistant Interface**

A lightweight interface that accepts the current game state, runs the RAG pipeline, and presents recommendations during live play.

---

### RAG Architecture

```
Current game state
    │
    ▼
Feature extraction (same features as stored in corpus)
    │
    ▼
Embedding model → query vector
    │
    ▼
Vector store (FAISS / Chroma / Pinecone)
    │  top-K nearest neighbors
    ▼
Retrieved examples:
  { game_state_summary, action_taken, outcome }  × K
    │
    ▼
LLM prompt:
  "Given the current state [compact summary],
   here are K similar historical situations and what happened:
   [retrieved examples]
   What should I do, and why?"
    │
    ▼
Natural-language recommendation + reasoning
```

**Retrieval corpus schema (one record per decision point):**

| Field | Description |
|-------|-------------|
| `embedding` | Dense vector of game state features at decision time |
| `game_state_summary` | Compact text serialization of board state |
| `decision_type` | `bid_iron_throne`, `bid_fiefdom`, `bid_kings_court`, `house_card`, etc. |
| `faction` | Faction making the decision |
| `action_taken` | The bid value or card played |
| `outcome_label` | `strong` / `neutral` / `weak` (based on final rank) |
| `outcome_detail` | Final castle count, rank, win/loss |

---

### Development Cycle (Extraction)

Run tasks with VSCode Task Runner:
- Watch Typescript (`watch.ps1`)
- Serve Injection Script (`host.ps1`)
- Reload authenticated page

---

### Project Structure

```
0_Extraction/         - Browser injection script (TypeScript, compiled to JS)
  Data/               - Raw scraped JSON files (one per game session)
!Contracts/           - TypeScript type definitions for scraped data
2_Reporting/          - Python analysis and visualization
  Contracts/          - Python mirrors of the TS contracts
  Framework/          - Data loader, reporting engine
  Modules/            - Display, per-analyzer modules
Training/
  format_data.py      - Joins events to game state, extracts feature vectors + outcome labels
  embed_corpus.py     - Embeds feature vectors, builds and persists the vector store
  evaluate_retrieval.py - Measures retrieval quality (do top-K neighbors share the same outcome?)
Inference/
  retrieve.py         - Embeds current game state, queries vector store for top-K neighbors
  explain.py          - Formats retrieved examples into LLM prompt, calls Claude/GPT-4 API
  predict.py          - End-to-end: retrieve + explain → recommendation
RAG/
  corpus/             - Persisted vector store (FAISS index + metadata)
  prompts/            - Prompt templates for each decision type
```

---

### Why RAG (Not Fine-tuning or Pure ML)

**Fine-tuning** an LLM to output bid numbers would work, but requires retraining as the corpus grows and loses interpretability.

**Pure ML** (XGBoost etc.) on tabular features trains quickly and is accurate for numeric outputs, but produces no explanation and can't generalize to novel board states with qualitative context.

**RAG** combines both strengths:
- Retrieval grounds the LLM in real historical precedents — it's not hallucinating; it's citing specific past games
- The LLM's reasoning strength is used for what it's actually good at: synthesizing multiple examples and explaining *why* an action is good given this board state
- The corpus naturally improves as more games are collected — no retraining step
- Retrieved examples are inspectable, making recommendations auditable

ML models (XGBoost bid predictor, card predictor) remain useful as fast, lightweight signals that can be included as additional context in the RAG prompt alongside retrieved examples.

---

### Data Collected Per Game

Each scraped game file contains:

| Field | Description |
|-------|-------------|
| `Players` | Player IDs and usernames (6-7 per game) |
| `combatLogs` | All battles: armies, house cards, support, wounds, winner (~46/game) |
| `TrackBids` | Bids on Iron Throne / Fiefdom / King's Court tracks (~78/game) |
| `WildlingBids` | Power token bids against wildling invasions (~25/game) |
| `Rounds` | Full game state snapshot at every log entry (~1,100/game) |

Both `combatLogs` and `TrackBids` carry a `currentGameStateReferenceIndex` that points directly into the `Rounds` array, giving full board context (unit positions, order tokens, all faction resources) at the moment of each decision without duplicating data.

`Rounds` (as `LogIndexToGameRound`) additionally provides: track position arrays, wildling/dragon strength, Valyrian Steel Blade usage, victory track standings, and Iron Bank state.

**At 1,000 games:**
- ~46,000 labeled combat encounters
- ~78,000 labeled bid decisions
- ~1,100,000 game state snapshots → retrieval corpus

---

### Data Pipeline

#### The State Join

Every decision record starts with the same join:

```
event.currentGameStateReferenceIndex
    -> Rounds[index]                    (LogIndexToGameRound)
       - ironThroneTrack: Factions[]   (ordered = rank 1..N)
       - fiefdomsTrack: Factions[]
       - kingsCourtTrack: Factions[]
       - housesOnVictoryTrack
       - wildlingStrength, vsbUsed
    -> ExtractedGameStateData[index]   (unit positions, order tokens, resource snapshots)
```

This gives complete board state at the time of each bid or combat decision, which becomes the feature vector for embedding.

#### House Card Availability

A critical mechanic: played cards are discarded until reset. To reconstruct which cards are available at any combat decision, `format_data.py` scans all prior `combatLogs` in the same game for the same faction and subtracts played cards from the known starting deck. Available card set is included in the feature vector.

#### Outcome Labels

At the end of each game, rank all factions by final castle count:
- **Top 2** factions: their actions are labeled `strong`
- **Bottom 2** factions: their actions are labeled `weak`
- **Middle** factions: labeled `neutral`

These labels are stored in the retrieval corpus and surfaced to the LLM as part of each retrieved example.

#### Train / Val / Test Split (for retrieval evaluation)

- 80% corpus / 10% validation / 10% test
- **Split by game, not by event.** Events from the same game must never appear across splits.

---

### Retrieval Evaluation

Before using the system for recommendations, evaluate whether retrieval is actually finding meaningful neighbors:

| Metric | Description | Target |
|--------|-------------|--------|
| Outcome consistency | Do top-K neighbors share the same outcome label as the query? | > chance |
| Action overlap | For bids: is the retrieved median bid close to the query bid? | MAE < historical mean baseline |
| Retrieval diversity | Are neighbors from diverse games, not just the same session? | < 20% same-game neighbors |

If retrieval quality is poor, the issue is likely in the feature vector design — not the LLM.

---

### LLM Prompt Design

The LLM receives a structured prompt containing:
- Current game state (compact text serialization, ~300-500 tokens)
- K retrieved historical situations with: state summary, action taken, outcome label
- The decision to make (e.g. "how much should Stark bid on the Iron Throne?")

It returns a 3-5 sentence plain-language recommendation citing specific retrieved examples.

**Prompt serialization rules:**
- Natural language, not raw JSON
- Consistent field order every time (LLMs are sensitive to format variation)
- Omit irrelevant factions/regions to stay within token budget
- Retrieved examples sorted by similarity score (most similar first)

---

### Roadmap

- [x] Proof-of-concept scraper (6 games collected)
- [ ] Collect ~1,000 games
- [ ] Build `Training/format_data.py` — state join, card availability tracking, outcome label generation
- [ ] Build `Training/embed_corpus.py` — embed feature vectors, populate vector store
- [ ] Smoke-test retrieval on 6 games: are neighbors visually sensible?
- [ ] Build `Inference/retrieve.py` + `Inference/explain.py`
- [ ] Evaluate retrieval quality (outcome consistency, action overlap)
- [ ] Full corpus build on 1,000-game dataset
- [ ] Tune prompt templates per decision type
- [ ] User-facing assistant interface for live play

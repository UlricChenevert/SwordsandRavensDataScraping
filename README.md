### Overview

### High-level Process
Because of reasonable browser constraints, you have to build the file, serve it to Tampermonkey, and Tampermonkey attaches injects the data miner to the gameClient class, which deserializes the data with the onMessage function on initialization. Once the data is deserialized, the script does some analysis and downloads the data

### Goals
Wreck everyone in Game of Thrones through well-informed stats, strategy, and LLM analysis :)

### Development Cycle
Run tasks with VSCode Task Runner
- Watch Typescript (watch.ps1)
- Serve Injection Script (host.ps1)
- Reload authenticated page
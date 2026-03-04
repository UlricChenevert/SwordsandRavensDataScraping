from typing import Any, Literal, Sequence, Tuple


def subplots(
    nrows: int = ...,
    ncols: int = ...,
    *,
    sharex: bool | Literal["none", "all", "row", "col"] = ...,
    sharey: bool | Literal["none", "all", "row", "col"] = ...,
    squeeze: bool = ...,
    width_ratios: Sequence[float] | None = ...,
    height_ratios: Sequence[float] | None = ...,
    subplot_kw: dict[str, Any] | None = ...,
    gridspec_kw: dict[str, Any] | None = ...,
    **fig_kw: Any,
) -> Tuple[Any, Any]: ...

def tight_layout(**kwargs: Any) -> None: ...

def show(*, block: bool | None = ...) -> None: ...

cm: Any

def __getattr__(name: str) -> Any: ...

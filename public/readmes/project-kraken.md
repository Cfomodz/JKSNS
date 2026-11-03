# project_kraken

**Kraken: A Cascade CTF-Autosolver** · v0.2.5 · July 2026

An autonomous CTF solver that reasons, runs tools, and captures flags with no human in the loop. Each challenge descends a cheapest-first cascade: deterministic tooling first, model reasoning only when computation runs out, and a deterministic flag validator as the sole oracle.

## Highlights

- BYU EOS CTF 2026: cleared 39 of 42 challenges (every online-solvable one) in about ten minutes, fully autonomous
- KalmarCTF 2026 (an anti-AI event): 26th of 275 teams, including the 92-position FPGA flag_checker solve
- Found and exploited a previously unreported path traversal in CTFd 3.8.1, fixed upstream in 3.8.2
- CTFTiny: 23 of 23 static challenges, 21 of them with zero model tokens on a local model
- MITRE eCTF: full breakdown of an embedded firmware target in about ten minutes of analysis

## Competition results

| Season | Event | Result |
|---|---|---|
| [2025-2026](/experience/season-2025-2026) | KalmarCTF 2026 | 26th of 275 (top 10%, with KRAKEN) |
| [2025-2026](/experience/season-2025-2026) | BYU EOS CTF 2026 | 39 of 42 online-solvable challenges (autonomous with KRAKEN, unranked by request) |

## Stack

Python · LangGraph · Ollama · MCP · Ghidra · angr · pwntools

## Links

- Repo: [github.com/JKSNS/project_kraken](https://github.com/JKSNS/project_kraken)
- Paper: [project_kraken-v0.2.5.pdf](/papers/project_kraken-v0.2.5.pdf)
- Blog write-up: open **Browser** → *Kraken: A Cascade CTF-Autosolver*

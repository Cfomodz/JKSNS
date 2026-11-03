# Capture the Flag

Jeopardy-style CTFs. Several recent runs used [KRAKEN](/projects/project-kraken), my autonomous CTF solver, so those entries note how the result was earned.

## KalmarCTF 2026

KalmarCTF was explicitly an anti-AI event. Playing as one human plus a Claude-driven KRAKEN agent, for less than half of the competition window, we placed 26th of 275 teams (top 10%).

- **flag_checker** (1000-point reversing, zero solves at release): the only artifact was an iCE40 HX8K FPGA bitstream. The agent converted it to a Verilog netlist, found the signal that pulses on each correct character, built a UART testbench, and brute-forced the flag one position at a time across 92 positions. The flag turned out to be the author's own bet that an AI could not solve it.
- A ring-0 kernel exploit on a hobby OS (an LDT call gate plus a ROP chain) in about thirty minutes.
- Neural-network weight recovery from a black-box oracle by gradient peeling in about forty minutes.

## BYU EOS CTF 2026

KRAKEN pulled every challenge from CTFd and dispatched one agent per challenge. It cleared every challenge that could be solved online, 39 of 42, in a single wave of about ten minutes, fully hands-off. I played remotely, three challenges required being there in person, and I asked to be removed from the leaderboard, so there is no official placement.

## Lockheed Martin Aerospace Cyber Range CTF, DEF CON 33

First blood on challenge 12.

## Results by season

| Season | Event | Result |
|---|---|---|
| [2025-2026](/experience/season-2025-2026) | Lockheed Martin Aerospace Cyber Range DEF CON 33 CTF | 1st blood, challenge 12 |
| [2025-2026](/experience/season-2025-2026) | KalmarCTF 2026 | 26th of 275 (top 10%, with [KRAKEN](/projects/project-kraken)) |
| [2025-2026](/experience/season-2025-2026) | BYU EOS CTF 2026 | 39 of 42 online-solvable challenges (autonomous with [KRAKEN](/projects/project-kraken), unranked by request) |

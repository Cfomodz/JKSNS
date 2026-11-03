# Jackson Stephens
**Security Engineer & Researcher**

jackson@stephens.sh
[GitHub](https://github.com/JKSNS) | [LinkedIn](https://linkedin.com/in/profile-jackson-stephens/) | [jackson.stephens.sh](https://jackson.stephens.sh)

---

## Summary

Security engineer and researcher with three seasons on the collegiate cyber defense circuit (RMCCDC regional champion, National CCDC competitor, DOE CyberForce) and a current focus on AI-augmented security. Builds autonomous tooling that holds up in live competition: KRAKEN cleared every online-solvable challenge at BYU EOS CTF 2026 and placed 26th of 275 at KalmarCTF 2026, and claude_preflight puts a fail-closed policy gate in front of every action a coding agent takes. First place in Sandia National Laboratories' lab-wide ML/DL hackathon and internal ML competition.

---

## Technical Skills

**Network Defense**
Firewall Configuration, IDS/IPS, Network Monitoring, Traffic Analysis, Segmentation

**Incident Response**
Threat Detection, Log Analysis, Forensics, Malware Triage, SIEM Operations

**System Hardening**
Linux/Windows Hardening, Patch Management, Group Policy, Secure Baselines, CIS Benchmarks

**Reverse Engineering & Exploitation**
Ghidra, angr, radare2, pwntools, x86-64 Binary Analysis, Firmware Analysis

**Vulnerability Assessment**
Nmap, Nessus, Burp Suite, Web Application Testing, Risk Prioritization

**AI & Agent Systems**
LangGraph, Model Context Protocol (MCP), Ollama, Claude Code, Cedar Policy-as-Code

**Infrastructure Security**
Active Directory, DNS, Web Servers, Database Security, Cloud Security Fundamentals

**Tools & Platforms**
Python, Bash, PowerShell, TypeScript, Wireshark, Splunk, ELK Stack, Docker, Git

---

## Featured Projects

### KRAKEN: Autonomous CTF Auto-Solver
*Python, LangGraph, Ollama, MCP · [github.com/JKSNS/project_kraken](https://github.com/JKSNS/project_kraken)*

- Built a 20-node LangGraph engine that routes each challenge through a cheapest-first cascade: deterministic tooling first, model reasoning last, and a deterministic flag validator as the only oracle
- Cleared 39 of 42 challenges (every online-solvable one) at BYU EOS CTF 2026 in about ten minutes, fully autonomous
- Placed 26th of 275 at KalmarCTF 2026, an anti-AI event, including a 92-position FPGA bitstream solve
- Found and exploited a previously unreported path traversal in CTFd 3.8.1, fixed upstream in 3.8.2
- 85 registered analysis tools, a 30-tool MCP server, and 1,037 tests; documented in a 16-page technical report

---

### claude_preflight: Governed Coding Agents
*Shell, Python, Cedar · [github.com/JKSNS/claude_preflight](https://github.com/JKSNS/claude_preflight)*

- Fail-closed Cedar policy gate that authorizes every agent tool call before it runs, backed by 260 pinned verdicts
- Stops 14 of 14 harmful operations that an un-gated agent executes, with 0 false positives and p50 latency of 93 ms
- Human ratification for rule changes and re-injection of the design spine after context compaction
- Technical report v0.9.9 publishes its negative results unchanged

---

### distillr: Grounded Daily Digests
*Python, ffmpeg, Ollama · [github.com/JKSNS/distillr](https://github.com/JKSNS/distillr)*

- Pulls the day's research and tools from arXiv, Hugging Face, Hacker News, GitHub, and RSS
- Assembles every claim with no model, so each bullet keeps the exact source sentence it came from
- Renders narrated vertical reels in three series (papers, coding problems, CTF solves) from one engine

---

## Experience

### Collegiate Cyber Defense Competition (CCDC)
**RMCCDC and National CCDC**
*2023 – 2026*

- RMCCDC Qualifiers: 1st place in each of three seasons (the first as an alternate)
- RMCCDC Regionals: 1st place in 2024-2025 (and in 2023-2024 as an alternate), 2nd place in 2025-2026
- Competed at National CCDC in 2024-2025 against a professional red team
- Managed cross-platform environments including Windows Server, Linux, and network appliances
- Built and executed incident response playbooks under live attack conditions
- Mentored team members on defensive techniques and competition strategy

---

### Competitions
**Sandia National Laboratories, U.S. DOE, and CTFs**
*2023 – Present*

- Sandia National Laboratories Lab-Wide ML/DL Hackathon: 1st place (2026-2027)
- Sandia National Laboratories Internal ML Competition: 1st place (2025-2026)
- Sandia National Laboratories TracerFire DFIR CTF: 2nd place (2025-2026)
- U.S. DOE CyberForce Competition: competitor (2024-2025, 2025-2026)
- Lockheed Martin Aerospace Cyber Range CTF at DEF CON 33: first blood on challenge 12
- Full history by season: [jackson.stephens.sh/experience](https://jackson.stephens.sh/experience)

---

### Security Research
**Independent**
*2022 – Present*

- Builds AI-augmented security tooling: autonomous CTF solving, agent governance, and grounded research digests
- Publishes open-source tools with technical reports, including the results that did not pan out
- Developed security tooling and automation scripts for reconnaissance and hardening
- Web application penetration testing and remediation, and x86-64 reverse engineering

# SEO Metadata Report — JSOS

Every value below is generated from code: `src/lib/seo/metadata.ts` (site config),
`src/lib/seo/entity.ts` (identity), and `src/lib/portfolio/` (projects and competitions).
Regenerate this table whenever routes or descriptions change.

---

## 1. Site Configuration

| Property | Value |
|----------|-------|
| **Name** | Jackson Stephens |
| **Title** | Security Engineer & Researcher |
| **Site Name** | JSOS |
| **Base URL** | https://jackson.stephens.sh |
| **OG Image** | /assets/web_assets/og.png |
| **Twitter** | @JKSNS |

**Site Description:**
> Security engineer and researcher. Collegiate cyber defense competitor (RMCCDC, National CCDC, DOE CyberForce) building AI-augmented security tools: KRAKEN, claude_preflight, and distillr.

---

## 2. Person Schema (JSON-LD)

Injected on all pages via `app/layout.tsx`, wrapped in a ProfilePage.

| Property | Value |
|----------|-------|
| **Name** | Jackson Stephens |
| **Job Title** | Security Engineer & Researcher |
| **Location** | United States |
| **worksFor / alumniOf** | Omitted until an employer or school is recorded in `entity.ts` |

**Social Links (sameAs):**
- https://github.com/JKSNS
- https://www.linkedin.com/in/profile-jackson-stephens/
- https://twitter.com/JKSNS

**Knows About** (shared with the About app's Focus list, `src/lib/portfolio/profile.ts`):
Network Defense, Incident Response, Digital Forensics, Reverse Engineering, Vulnerability Research,
Capture the Flag, AI Agents, Policy as Code, Machine Learning, Linux and Windows Hardening, Python,
TypeScript.

---

## 3. Route Metadata

| Path | Title | Description |
|------|-------|-------------|
| `/` | Jackson Stephens | Security Engineer & Researcher | Security engineer and researcher. Collegiate cyber defense competitor (RMCCDC, National CCDC, DOE CyberForce) building AI-augmented security tools: KRAKEN, claude_preflight, and distillr. |
| `/about` | About | About Jackson Stephens: security engineer and researcher. Collegiate cyber defense competitor (RMCCDC, National CCDC, DOE CyberForce) building AI-augmented security tools. |
| `/resume` | Resume | Resume of Jackson Stephens: security engineering, incident response, CTF auto-solving, agent governance, and competition results. |
| `/projects` | Projects | Projects by Jackson Stephens: KRAKEN (autonomous CTF solver), claude_preflight (governed coding agents), distillr (grounded daily digests), and JSOS. |
| `/experience` | Competitions | Competition history of Jackson Stephens by season: CCDC, DOE CyberForce, Sandia National Laboratories, and CTFs including KalmarCTF and BYU EOS CTF. |
| `/projects/project-kraken` | project_kraken · Kraken: A Cascade CTF-Autosolver | project_kraken: An autonomous CTF solver that reasons, runs tools, and captures flags with no human in the loop. |
| `/projects/claude-preflight` | claude_preflight · Directing Intelligence with Governed Agents | claude_preflight: A harness for frontier coding agents: a fail-closed Cedar policy gate authorizes every tool call, changes to the rules need human ratification, and the project's design spine is re-injected after context compaction. |
| `/projects/distillr` | distillr · Daily digests and narrated reels for papers, code, and CTFs | distillr: A self-hosted daily digest and video studio for research papers, competitive programming, and CTF solving. |
| `/projects/jsos` | JSOS · A portfolio that runs like an operating system | JSOS: A browser desktop with draggable windows, a dock, a terminal with a virtual filesystem and games, and a blog. |
| `/projects/earlier-work` | Earlier Work | Earlier coursework and personal projects: reverse engineering, web penetration testing, networking labs, and a Raspberry Pi camera. |
| `/experience/season-2026-2027` | 2026-2027 Competition Results | Jackson Stephens's 2026-2027 competition results: 1 event (Sandia National Laboratories). |
| `/experience/season-2025-2026` | 2025-2026 Competition Results | Jackson Stephens's 2025-2026 competition results: 15 events (RMCCDC and CCDC Invitationals, DOE CyberForce, Sandia National Laboratories, Capture the Flag). |
| `/experience/season-2024-2025` | 2024-2025 Competition Results | Jackson Stephens's 2024-2025 competition results: 8 events (National CCDC, RMCCDC and CCDC Invitationals, Other Cyber Defense Competitions, DOE CyberForce). |
| `/experience/season-2023-2024` | 2023-2024 Competition Results | Jackson Stephens's 2023-2024 competition results: 4 events (National CCDC, RMCCDC and CCDC Invitationals, Other Cyber Defense Competitions). |
| `/experience/nccdc` | National CCDC | National Collegiate Cyber Defense Competition: regional champions defend enterprise networks against a professional red team. |
| `/experience/rmccdc` | RMCCDC and CCDC Invitationals | Rocky Mountain CCDC qualifiers and regionals, plus the WRCCDC and MWCCDC invitationals used to train for them. |
| `/experience/cyberforce` | DOE CyberForce | U.S. Department of Energy CyberForce Competition: defending simulated energy-sector IT and OT infrastructure. |
| `/experience/sandia` | Sandia National Laboratories | Internal Sandia competitions: machine-learning challenges and the TracerFire forensics and incident-response CTF. |
| `/experience/ctf` | Capture the Flag | Jeopardy CTFs, including KalmarCTF and BYU EOS CTF runs with the KRAKEN auto-solver. |
| `/experience/defense` | Other Cyber Defense Competitions | Hivestorm and eCitadel, collegiate defensive competitions outside the CCDC circuit. |

Project pages also carry a SoftwareApplication schema built from `src/lib/portfolio/projects.ts`.

---

**Report updated:** 2026-11-03

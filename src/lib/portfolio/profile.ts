/**
 * Bio copy shared by the About app, the terminal `about` command, and the
 * Person schema. Keep it short; details live in projects.ts and competitions.ts.
 */

export const PROFILE_INTRO = "I like to build cool things, like this website!";

export const PROFILE_PARAGRAPHS: string[] = [
	"I'm a security engineer and researcher. Since 2023 I've competed on the collegiate cyber defense circuit (RMCCDC, National CCDC, and DOE CyberForce), keeping live enterprise networks running while professional red teams try to take them.",
	"Lately most of my time goes to AI-augmented security work: KRAKEN, an autonomous CTF solver that spends compute before tokens; claude_preflight, a policy gate and anti-forgetting harness for coding agents; and distillr, a grounded daily digest for papers, code, and CTFs. The direction I'm heading is full vulnerability-research agents.",
];

/** Areas of expertise, used for schema.org knowsAbout and the About app. */
export const FOCUS_AREAS: string[] = [
	"Network Defense",
	"Incident Response",
	"Digital Forensics",
	"Reverse Engineering",
	"Vulnerability Research",
	"Capture the Flag",
	"AI Agents",
	"Policy as Code",
	"Machine Learning",
	"Linux and Windows Hardening",
	"Python",
	"TypeScript",
];

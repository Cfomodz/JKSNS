/**
 * Projects: single source of truth.
 *
 * Read by the About app (Projects tab), the terminal VFS (/projects), the
 * desktop Projects folder, page metadata, and the SoftwareApplication schema.
 * Facts here are taken from each repository's README and technical report.
 */

export interface Project {
	/** URL slug: /projects/<slug> */
	slug: string;
	/** Repository-style name shown in lists. */
	name: string;
	/** Short name used in prose, e.g. "KRAKEN"; linked when it appears in a result note. */
	alias?: string;
	/** One-line title or paper title. */
	tagline: string;
	version?: string;
	/** When the latest release or report landed. */
	updated: string;
	/** Two-sentence description. */
	blurb: string;
	/** Concrete, sourced results. */
	highlights: string[];
	stack: string[];
	repoUrl: string;
	paperUrl?: string;
	/** Markdown write-up in /public. */
	readme: string;
	/** Filename shown in the Projects folder and terminal. */
	fileName: string;
	/** Title of the matching post in the Browser app, if there is one. */
	blogTitle?: string;
	/** Schema.org category for the SoftwareApplication schema. */
	applicationCategory: string;
	keywords: string[];
}

export const PROJECTS: Project[] = [
	{
		slug: "project-kraken",
		name: "project_kraken",
		alias: "KRAKEN",
		tagline: "Kraken: A Cascade CTF-Autosolver",
		version: "v0.2.5",
		updated: "July 2026",
		blurb:
			"An autonomous CTF solver that reasons, runs tools, and captures flags with no human in the loop. Each challenge descends a cheapest-first cascade: deterministic tooling first, model reasoning only when computation runs out, and a deterministic flag validator as the sole oracle.",
		highlights: [
			"BYU EOS CTF 2026: cleared 39 of 42 challenges (every online-solvable one) in about ten minutes, fully autonomous",
			"KalmarCTF 2026 (an anti-AI event): 26th of 275 teams, including the 92-position FPGA flag_checker solve",
			"Found and exploited a previously unreported path traversal in CTFd 3.8.1, fixed upstream in 3.8.2",
			"CTFTiny: 23 of 23 static challenges, 21 of them with zero model tokens on a local model",
			"MITRE eCTF: full breakdown of an embedded firmware target in about ten minutes of analysis",
		],
		stack: ["Python", "LangGraph", "Ollama", "MCP", "Ghidra", "angr", "pwntools"],
		repoUrl: "https://github.com/JKSNS/project_kraken",
		paperUrl: "/papers/project_kraken-v0.2.5.pdf",
		readme: "/readmes/project-kraken.md",
		fileName: "project_kraken.md",
		blogTitle: "Kraken: A Cascade CTF-Autosolver",
		applicationCategory: "SecurityApplication",
		keywords: [
			"CTF",
			"autonomous agents",
			"LangGraph",
			"reverse engineering",
			"vulnerability research",
		],
	},
	{
		slug: "claude-preflight",
		name: "claude_preflight",
		tagline: "Directing Intelligence with Governed Agents",
		version: "v0.9.9",
		updated: "August 2026",
		blurb:
			"A harness for frontier coding agents: a fail-closed Cedar policy gate authorizes every tool call, changes to the rules need human ratification, and the project's design spine is re-injected after context compaction. Its claims about itself are executable tests, so they cannot quietly drift.",
		highlights: [
			"14 of 14 harmful operations stopped that an un-gated agent executes, with 0 false positives",
			"260 pinned policy verdicts (179 shell, 81 filesystem)",
			"36 of 36 obfuscation and bypass cases enforced, with 4 residuals disclosed",
			"24 of 24 self-test suites; typical gate latency p50 93 ms",
			"Adopted into 4 of 4 foreign repositories with existing agent rules left byte-identical",
		],
		stack: ["Shell", "Python", "Cedar", "Claude Code hooks"],
		repoUrl: "https://github.com/JKSNS/claude_preflight",
		paperUrl: "/papers/claude_preflight_v0.9.9.pdf",
		readme: "/readmes/claude-preflight.md",
		fileName: "claude_preflight.md",
		blogTitle: "Directing Intelligence with Governed Agents",
		applicationCategory: "DeveloperApplication",
		keywords: ["AI agents", "policy as code", "Cedar", "agent governance", "Claude Code"],
	},
	{
		slug: "distillr",
		name: "distillr",
		tagline: "Daily digests and narrated reels for papers, code, and CTFs",
		updated: "July 2026",
		blurb:
			"A self-hosted daily digest and video studio for research papers, competitive programming, and CTF solving. It pulls the day's notable research and tools from arXiv, Hugging Face, Hacker News, GitHub, or any RSS feed, and turns them into grounded markdown, shareable cards, and narrated vertical reels.",
		highlights: [
			"Grounded by design: the factual skeleton is assembled with no model, so every bullet keeps the exact source sentence it came from",
			"Three video series from one engine: Paper of the Day, Dev Solve of the Day, and CTF Solve of the Day",
			"The digest runs on the Python standard library alone, with no account or API key",
			"Pluggable prose backends: none, a local Ollama model, the Claude Code CLI, or any OpenAI-compatible endpoint",
		],
		stack: ["Python", "ffmpeg", "Ollama", "Claude Code"],
		repoUrl: "https://github.com/JKSNS/distillr",
		readme: "/readmes/distillr.md",
		fileName: "distillr.md",
		applicationCategory: "MultimediaApplication",
		keywords: ["research digest", "arXiv", "video generation", "CTF", "self-hosted"],
	},
	{
		slug: "jsos",
		name: "JSOS",
		tagline: "A portfolio that runs like an operating system",
		updated: "November 2026",
		blurb:
			"A browser desktop with draggable windows, a dock, a terminal with a virtual filesystem and games, and a blog. It is a fully static Next.js export served from GitHub Pages.",
		highlights: [
			"Every window has its own crawlable URL, server-rendered for search engines",
			"Terminal with a virtual filesystem, tab completion, Snake, Tetris, 2048, and a few easter eggs",
			"Wallpaper, dock, icon, and terminal-color preferences persist across visits",
		],
		stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion"],
		repoUrl: "https://github.com/JKSNS/JKSNS.github.io",
		readme: "/readmes/jsos.md",
		fileName: "jsos.md",
		blogTitle: "I built an OS in the browser for my portfolio",
		applicationCategory: "WebApplication",
		keywords: ["portfolio", "Next.js", "web OS"],
	},
];

export interface ArchiveProject {
	name: string;
	year: string;
	blurb: string;
	repoUrl: string;
}

/** Earlier coursework and personal projects. */
export const ARCHIVE_PROJECTS: ArchiveProject[] = [
	{
		name: "Pi-Polaroid",
		year: "2024",
		blurb:
			"Raspberry Pi Zero 2 W camera with image processing, display handling, client-server communication, and a 3D-printed enclosure.",
		repoUrl: "https://github.com/JKSNS/Pi-Polaroid",
	},
	{
		name: "Binary Bomb",
		year: "2024",
		blurb:
			"x86-64 reverse-engineering walkthrough of all six phases plus the secret phase, using a debugger and disassembler.",
		repoUrl: "https://github.com/JKSNS/Binary-Bomb",
	},
	{
		name: "OWASP Juice Shop Vulnerability Assessment",
		year: "2023",
		blurb:
			"Web penetration test report covering directory traversal, unauthorized administrative access, and SQL injection.",
		repoUrl: "https://github.com/JKSNS/OWASP-Juice-Shop-Vuln-Assessment",
	},
	{
		name: "OWASP Juice Shop Critical Patches",
		year: "2023",
		blurb:
			"Remediation write-up with the code changes that close the assessment's critical findings.",
		repoUrl: "https://github.com/JKSNS/OWASP-Juice-Shop-Critical-Patches",
	},
	{
		name: "Networking labs",
		year: "2024",
		blurb:
			"Static and dynamic routing, full-mesh switching and routing, and network troubleshooting labs.",
		repoUrl: "https://github.com/JKSNS/Dynamic-Routing-Network-Configuration",
	},
];

export const ARCHIVE_README = "/readmes/earlier-work.md";

export function getProjectBySlug(slug: string): Project | undefined {
	return PROJECTS.find((project) => project.slug === slug);
}

/** Plain-text project summary, used by the terminal VFS. */
export function renderProjectText(project: Project): string {
	const title = project.version
		? `${project.name}: ${project.tagline} (${project.version})`
		: `${project.name}: ${project.tagline}`;
	return [
		title,
		"",
		project.blurb,
		"",
		...project.highlights.map((h) => `* ${h}`),
		"",
		`Stack: ${project.stack.join(", ")}`,
		`Repo:  ${project.repoUrl}`,
		...(project.paperUrl ? [`Paper: ${project.paperUrl}`] : []),
	].join("\n");
}

/** Plain-text archive listing, used by the terminal VFS. */
export function renderArchiveText(): string {
	return [
		"Earlier work",
		"",
		...ARCHIVE_PROJECTS.flatMap((p) => [
			`${p.name} (${p.year})`,
			`  ${p.blurb}`,
			`  ${p.repoUrl}`,
			"",
		]),
	]
		.join("\n")
		.trimEnd();
}

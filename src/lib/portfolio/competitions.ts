/**
 * Competition history: single source of truth.
 *
 * Every place the site lists competition results reads from here:
 * - About app, Competitions tab
 * - Terminal VFS (/competitions)
 * - Desktop Competitions folder (season files + event write-ups)
 *
 * The markdown files in public/readmes/ (comp-*.md and the event write-ups)
 * are checked against this data by portfolio.test.ts, so a result added here
 * and forgotten there fails the test suite instead of silently drifting.
 */

/** Event series. Each one has a write-up that lists its results by season. */
export type CompetitionSeriesId = "nccdc" | "rmccdc" | "cyberforce" | "sandia" | "ctf" | "defense";

export interface CompetitionSeries {
	id: CompetitionSeriesId;
	/** Display name for the write-up. */
	name: string;
	/** One-line summary used in metadata and terminal output. */
	summary: string;
	/** Markdown write-up in /public. */
	readme: string;
	/** Filename shown in the Competitions folder and terminal. */
	fileName: string;
}

export interface CompetitionResult {
	/** Event name as it appears in the results list. */
	event: string;
	/** Placement or participation, e.g. "1st Place", "Competitor". */
	result: string;
	/** Optional qualifier rendered in parentheses, e.g. "Alternate". */
	note?: string;
	series: CompetitionSeriesId;
	/** Project slug when the result was earned with one of the projects. */
	project?: string;
}

export interface CompetitionSeason {
	/** Academic-year season, e.g. "2025-2026". */
	id: string;
	results: CompetitionResult[];
}

export const COMPETITION_SERIES: Record<CompetitionSeriesId, CompetitionSeries> = {
	nccdc: {
		id: "nccdc",
		name: "National CCDC",
		summary:
			"National Collegiate Cyber Defense Competition: regional champions defend enterprise networks against a professional red team.",
		readme: "/readmes/nccdc.md",
		fileName: "nccdc.md",
	},
	rmccdc: {
		id: "rmccdc",
		name: "RMCCDC and CCDC Invitationals",
		summary:
			"Rocky Mountain CCDC qualifiers and regionals, plus the WRCCDC and MWCCDC invitationals used to train for them.",
		readme: "/readmes/rmccdc.md",
		fileName: "rmccdc.md",
	},
	cyberforce: {
		id: "cyberforce",
		name: "DOE CyberForce",
		summary:
			"U.S. Department of Energy CyberForce Competition: defending simulated energy-sector IT and OT infrastructure.",
		readme: "/readmes/cyberforce.md",
		fileName: "cyberforce.md",
	},
	sandia: {
		id: "sandia",
		name: "Sandia National Laboratories",
		summary:
			"Internal Sandia competitions: machine-learning challenges and the TracerFire forensics and incident-response CTF.",
		readme: "/readmes/sandia.md",
		fileName: "sandia.md",
	},
	ctf: {
		id: "ctf",
		name: "Capture the Flag",
		summary: "Jeopardy CTFs, including KalmarCTF and BYU EOS CTF runs with the KRAKEN auto-solver.",
		readme: "/readmes/ctf.md",
		fileName: "ctf.md",
	},
	defense: {
		id: "defense",
		name: "Other Cyber Defense Competitions",
		summary: "Hivestorm and eCitadel, collegiate defensive competitions outside the CCDC circuit.",
		readme: "/readmes/cyber-defense.md",
		fileName: "cyber-defense.md",
	},
};

/** Display order for the event write-ups. */
export const COMPETITION_SERIES_ORDER: CompetitionSeriesId[] = [
	"nccdc",
	"rmccdc",
	"cyberforce",
	"sandia",
	"ctf",
	"defense",
];

/** Seasons, newest first. */
export const COMPETITION_SEASONS: CompetitionSeason[] = [
	{
		id: "2026-2027",
		results: [
			{
				event: "Sandia National Laboratories Lab-Wide ML/DL Hackathon",
				result: "1st Place",
				series: "sandia",
			},
		],
	},
	{
		id: "2025-2026",
		results: [
			{ event: "RMCCDC Regionals", result: "2nd Place", series: "rmccdc" },
			{ event: "RMCCDC Qualifiers", result: "1st Place", series: "rmccdc" },
			{ event: "U.S. DoE's CyberForce", result: "Competitor", series: "cyberforce" },
			{ event: "WRCCDC Invitational #1", result: "3rd Place", series: "rmccdc" },
			{ event: "WRCCDC Invitational #3", result: "2nd Place", series: "rmccdc" },
			{ event: "WRCCDC Invitational #4", result: "Competitor", series: "rmccdc" },
			{ event: "WRCCDC Invitational #5", result: "3rd Place", series: "rmccdc" },
			{ event: "MWCCDC Invitational #1", result: "2nd Place", series: "rmccdc" },
			{ event: "MWCCDC Invitational #2", result: "Competitor", series: "rmccdc" },
			{ event: "MWCCDC Invitational #3", result: "1st Place", series: "rmccdc" },
			{
				event: "Sandia National Laboratories Internal ML Competition",
				result: "1st Place",
				series: "sandia",
			},
			{
				event: "Sandia National Laboratories TracerFire DFIR CTF",
				result: "2nd Place",
				series: "sandia",
			},
			{
				event: "Lockheed Martin Aerospace Cyber Range DEF CON 33 CTF",
				result: "1st blood, challenge 12",
				series: "ctf",
			},
			{
				event: "KalmarCTF 2026",
				result: "26th of 275",
				note: "top 10%, with KRAKEN",
				series: "ctf",
				project: "project-kraken",
			},
			{
				event: "BYU EOS CTF 2026",
				result: "39 of 42 online-solvable challenges",
				note: "autonomous with KRAKEN, unranked by request",
				series: "ctf",
				project: "project-kraken",
			},
		],
	},
	{
		id: "2024-2025",
		results: [
			{ event: "National CCDC", result: "Competitor", series: "nccdc" },
			{ event: "RMCCDC Regionals", result: "1st Place", series: "rmccdc" },
			{ event: "RMCCDC Qualifiers", result: "1st Place", series: "rmccdc" },
			{ event: "WRCCDC Invitational #3", result: "Competitor", series: "rmccdc" },
			{ event: "WRCCDC Invitational #2", result: "Competitor", series: "rmccdc" },
			{ event: "MWCCDC Invitational", result: "2nd Place", series: "rmccdc" },
			{ event: "eCitadel", result: "Competitor", series: "defense" },
			{ event: "U.S. DoE's CyberForce", result: "Competitor", series: "cyberforce" },
		],
	},
	{
		id: "2023-2024",
		results: [
			{ event: "National CCDC", result: "Alternate", series: "nccdc" },
			{ event: "RMCCDC Regionals", result: "1st Place", note: "Alternate", series: "rmccdc" },
			{ event: "RMCCDC Qualifiers", result: "1st Place", note: "Alternate", series: "rmccdc" },
			{ event: "Hivestorm", result: "Competitor", series: "defense" },
		],
	},
];

/** "RMCCDC Regionals - 1st Place (Alternate)" */
export function formatCompetitionResult(result: CompetitionResult): string {
	const note = result.note ? ` (${result.note})` : "";
	return `${result.event} - ${result.result}${note}`;
}

/** Desktop/terminal slug for a season's results file. */
export function seasonSlug(seasonId: string): string {
	return `season-${seasonId}`;
}

/** Markdown file for a season's results. */
export function seasonReadme(seasonId: string): string {
	return `/readmes/comp-${seasonId}.md`;
}

export interface SeriesResult {
	season: string;
	result: CompetitionResult;
}

/** All results for one series, newest season first. */
export function getResultsForSeries(seriesId: CompetitionSeriesId): SeriesResult[] {
	return COMPETITION_SEASONS.flatMap((season) =>
		season.results
			.filter((result) => result.series === seriesId)
			.map((result) => ({ season: season.id, result })),
	);
}

/** Results earned with a given project (e.g. KRAKEN), newest first. */
export function getResultsForProject(projectSlug: string): SeriesResult[] {
	return COMPETITION_SEASONS.flatMap((season) =>
		season.results
			.filter((result) => result.project === projectSlug)
			.map((result) => ({ season: season.id, result })),
	);
}

/** Plain-text season results, used by the terminal VFS. */
export function renderSeasonText(season: CompetitionSeason): string {
	return [season.id, "", ...season.results.map(formatCompetitionResult)].join("\n");
}

/** Plain-text series summary, used by the terminal VFS. */
export function renderSeriesText(seriesId: CompetitionSeriesId): string {
	const series = COMPETITION_SERIES[seriesId];
	return [
		series.name,
		"",
		series.summary,
		"",
		...getResultsForSeries(seriesId).map(
			({ season, result }) => `${season}  ${formatCompetitionResult(result)}`,
		),
	].join("\n");
}

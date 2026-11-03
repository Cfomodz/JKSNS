/**
 * Markdown renderers for the generated files in public/readmes/.
 *
 * Season results, project pages, and the archive page are generated in full.
 * Event write-ups are hand-written, except for their "## Results by season"
 * section, which is generated. Run `npm run content:sync` after editing the
 * data; content-sync.test.ts fails while any file is out of date.
 */

import {
	COMPETITION_SEASONS,
	COMPETITION_SERIES,
	COMPETITION_SERIES_ORDER,
	type CompetitionResult,
	type CompetitionSeason,
	type CompetitionSeriesId,
	formatCompetitionResult,
	getResultsForProject,
	getResultsForSeries,
	type SeriesResult,
	seasonReadme,
	seasonSlug,
} from "./competitions";
import { ARCHIVE_PROJECTS, ARCHIVE_README, PROJECTS, type Project } from "./projects";

/** Heading that starts the generated block inside an event write-up. */
export const SERIES_RESULTS_HEADING = "## Results by season";

const seasonHref = (seasonId: string) => `/experience/${seasonSlug(seasonId)}`;
const seriesHref = (seriesId: CompetitionSeriesId) => `/experience/${seriesId}`;
const projectHref = (slug: string) => `/projects/${slug}`;

/**
 * Result text for markdown. When the result was earned with a project, the
 * project's alias in the note becomes a link (or a link is appended).
 */
function resultMarkdown(result: CompetitionResult, text: string, linkProject = true): string {
	if (!linkProject || !result.project) return text;
	const project = PROJECTS.find((p) => p.slug === result.project);
	if (!project) return text;
	const href = projectHref(project.slug);
	if (project.alias && text.includes(project.alias)) {
		return text.replace(project.alias, `[${project.alias}](${href})`);
	}
	return `${text} · [${project.name}](${href})`;
}

function resultsTable(rows: SeriesResult[], linkProjects = true): string[] {
	return [
		"| Season | Event | Result |",
		"|---|---|---|",
		...rows.map(({ season, result }) => {
			const cell = result.note ? `${result.result} (${result.note})` : result.result;
			return `| [${season}](${seasonHref(season)}) | ${result.event} | ${resultMarkdown(result, cell, linkProjects)} |`;
		}),
	];
}

/** Full contents of public/readmes/comp-<season>.md */
export function renderSeasonMarkdown(season: CompetitionSeason): string {
	const lines = [`# ${season.id}`, "", "## Competitions", ""];
	for (const result of season.results) {
		lines.push(`- ${resultMarkdown(result, formatCompetitionResult(result))}`);
	}

	lines.push("", "## By event", "");
	for (const seriesId of COMPETITION_SERIES_ORDER) {
		const count = season.results.filter((r) => r.series === seriesId).length;
		if (count === 0) continue;
		const series = COMPETITION_SERIES[seriesId];
		lines.push(
			`- [${series.name}](${seriesHref(seriesId)}): ${count} ${count === 1 ? "result" : "results"}`,
		);
	}

	const index = COMPETITION_SEASONS.findIndex((s) => s.id === season.id);
	const newer = COMPETITION_SEASONS[index - 1];
	const older = COMPETITION_SEASONS[index + 1];
	const nav = [
		newer ? `Newer: [${newer.id}](${seasonHref(newer.id)})` : "",
		older ? `Older: [${older.id}](${seasonHref(older.id)})` : "",
	].filter(Boolean);
	if (nav.length > 0) {
		lines.push("", "---", "", nav.join(" · "));
	}

	return `${lines.join("\n")}\n`;
}

/** The generated "## Results by season" block of an event write-up. */
export function renderSeriesResultsSection(seriesId: CompetitionSeriesId): string {
	const rows = getResultsForSeries(seriesId);
	return [SERIES_RESULTS_HEADING, "", ...resultsTable(rows), ""].join("\n");
}

/**
 * Replace (or append) the generated results block in a hand-written write-up.
 * The block runs from SERIES_RESULTS_HEADING to the next "## " heading or EOF.
 */
export function applySeriesResultsSection(markdown: string, seriesId: CompetitionSeriesId): string {
	const section = renderSeriesResultsSection(seriesId);
	const start = markdown.indexOf(SERIES_RESULTS_HEADING);
	if (start === -1) {
		return `${markdown.trimEnd()}\n\n${section}`;
	}
	const afterHeading = start + SERIES_RESULTS_HEADING.length;
	const nextHeading = markdown.indexOf("\n## ", afterHeading);
	const end = nextHeading === -1 ? markdown.length : nextHeading + 1;
	const rest = markdown.slice(end);
	return `${markdown.slice(0, start)}${section}${rest ? `\n${rest}` : ""}`;
}

/** Full contents of a project's page in public/readmes/. */
export function renderProjectMarkdown(project: Project): string {
	const meta = [project.version, project.updated].filter(Boolean).join(" · ");
	const lines = [
		`# ${project.name}`,
		"",
		`**${project.tagline}** · ${meta}`,
		"",
		project.blurb,
		"",
		"## Highlights",
		"",
		...project.highlights.map((h) => `- ${h}`),
	];

	const results = getResultsForProject(project.slug);
	if (results.length > 0) {
		lines.push("", "## Competition results", "", ...resultsTable(results, false));
	}

	lines.push("", "## Stack", "", project.stack.join(" · "), "", "## Links", "");
	lines.push(`- Repo: [${project.repoUrl.replace("https://", "")}](${project.repoUrl})`);
	if (project.paperUrl) {
		lines.push(`- Paper: [${project.paperUrl.split("/").pop()}](${project.paperUrl})`);
	}
	if (project.blogTitle) {
		lines.push(`- Blog write-up: open **Browser** → *${project.blogTitle}*`);
	}

	return `${lines.join("\n")}\n`;
}

/** Full contents of public/readmes/earlier-work.md */
export function renderArchiveMarkdown(): string {
	const lines = [
		"# Earlier work",
		"",
		"Coursework and personal projects from before the current ones. Current work is in the [Projects](/projects) folder.",
		"",
	];
	for (const project of ARCHIVE_PROJECTS) {
		lines.push(`## ${project.name}`, "", `*${project.year}*`, "", project.blurb, "");
		lines.push(`[${project.repoUrl.replace("https://", "")}](${project.repoUrl})`, "");
	}
	return `${lines.join("\n").trimEnd()}\n`;
}

/** Every fully generated file: public path → contents. */
export function getGeneratedFiles(): Record<string, string> {
	const files: Record<string, string> = {};
	for (const season of COMPETITION_SEASONS) {
		files[seasonReadme(season.id)] = renderSeasonMarkdown(season);
	}
	for (const project of PROJECTS) {
		files[project.readme] = renderProjectMarkdown(project);
	}
	files[ARCHIVE_README] = renderArchiveMarkdown();
	return files;
}

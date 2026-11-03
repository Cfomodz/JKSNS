/**
 * Keeps public/readmes/ in step with src/lib/portfolio.
 *
 * Fails when a generated file is stale. Regenerate with:
 *   npm run content:sync
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { findFileByContentUrl, getFilesForFolder } from "@/os/filesystem/files";

import { COMPETITION_SEASONS, COMPETITION_SERIES, COMPETITION_SERIES_ORDER } from "./competitions";
import { applySeriesResultsSection, getGeneratedFiles } from "./markdown";
import { PROJECTS } from "./projects";

const UPDATE = process.env.UPDATE_CONTENT === "1";
const publicPath = (url: string) => join(process.cwd(), "public", url.replace(/^\//, ""));

function sync(url: string, expected: string) {
	const path = publicPath(url);
	const actual = existsSync(path) ? readFileSync(path, "utf-8") : "";
	if (UPDATE && actual !== expected) {
		writeFileSync(path, expected);
		return;
	}
	expect(actual, `${url} is stale; run npm run content:sync`).toBe(expected);
}

describe("generated readmes", () => {
	for (const [url, contents] of Object.entries(getGeneratedFiles())) {
		it(`${url} matches the portfolio data`, () => sync(url, contents));
	}
});

describe("event write-ups", () => {
	for (const seriesId of COMPETITION_SERIES_ORDER) {
		const { readme } = COMPETITION_SERIES[seriesId];
		it(`${readme} has current results`, () => {
			const path = publicPath(readme);
			expect(existsSync(path), `${readme} is missing`).toBe(true);
			const actual = readFileSync(path, "utf-8");
			sync(readme, applySeriesResultsSection(actual, seriesId));
		});
	}
});

describe("data integrity", () => {
	it("every result belongs to a known series", () => {
		for (const season of COMPETITION_SEASONS) {
			for (const result of season.results) {
				expect(COMPETITION_SERIES[result.series], result.event).toBeDefined();
			}
		}
	});

	it("every project referenced by a result exists", () => {
		const slugs = new Set(PROJECTS.map((p) => p.slug));
		for (const season of COMPETITION_SEASONS) {
			for (const result of season.results) {
				if (result.project) expect(slugs.has(result.project), result.event).toBe(true);
			}
		}
	});

	it("seasons are unique and newest first", () => {
		const ids = COMPETITION_SEASONS.map((s) => s.id);
		expect(new Set(ids).size).toBe(ids.length);
		expect([...ids].sort().reverse()).toEqual(ids);
	});

	it("every desktop file points at a readme that exists", () => {
		for (const folderId of ["projects", "competitions"] as const) {
			for (const file of getFilesForFolder(folderId)) {
				expect(existsSync(publicPath(file.contentUrl)), file.contentUrl).toBe(true);
				expect(findFileByContentUrl(file.contentUrl)?.folderId).toBe(folderId);
			}
		}
	});

	it("file slugs are unique within each folder", () => {
		for (const folderId of ["projects", "competitions"] as const) {
			const slugs = getFilesForFolder(folderId).map((f) => f.slug);
			expect(new Set(slugs).size, folderId).toBe(slugs.length);
		}
	});
});

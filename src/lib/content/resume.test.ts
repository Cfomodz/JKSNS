import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { parseResumeMarkdown } from "./server";

describe("parseResumeMarkdown on the published resume", () => {
	const resume = parseResumeMarkdown(
		readFileSync(join(process.cwd(), "public/readmes/resume.md"), "utf-8"),
	);

	it("extracts identity and summary", () => {
		expect(resume.name).toBe("Jackson Stephens");
		expect(resume.title).toBe("Security Engineer & Researcher");
		expect(resume.summary.length).toBeGreaterThan(100);
	});

	it("extracts every skill category", () => {
		expect(Object.keys(resume.skills).length).toBeGreaterThanOrEqual(8);
	});

	it("extracts projects and experience with bullet points", () => {
		expect(resume.projects.map((p) => p.title)).toContain("KRAKEN: Autonomous CTF Auto-Solver");
		expect(resume.experience.length).toBeGreaterThanOrEqual(3);
		for (const section of [...resume.projects, ...resume.experience]) {
			expect(section.items.length, section.title).toBeGreaterThan(0);
		}
	});
});

/**
 * Virtual File System (VFS) Registry
 *
 * Hierarchical data structure mirroring the terminal VFS.
 * Desktop folders display the same tree the terminal exposes.
 */

import type { LucideIcon } from "lucide-react";
import { FileText } from "lucide-react";

import {
	ARCHIVE_README,
	COMPETITION_SEASONS,
	COMPETITION_SERIES,
	COMPETITION_SERIES_ORDER,
	type CompetitionSeason,
	PROJECTS,
	seasonReadme,
	seasonSlug,
} from "@/lib/portfolio";

/**
 * Supported file types in the VFS.
 */
export type FileType = "md" | "txt";

/**
 * A node in the desktop VFS — either a file or a folder.
 */
export type VFSEntry =
	| {
			kind: "file";
			id: string;
			name: string;
			type: FileType;
			icon: LucideIcon;
			/** URL path segment: /projects/<slug> or /experience/<slug> */
			slug: string;
			/** Page title for metadata (defaults to the filename) */
			pageTitle?: string;
			/** Page description for metadata */
			description?: string;
			/** URL to fetch content from /public, or inline content string */
			contentUrl?: string;
			/** Inline content (used when mirroring terminal VFS text) */
			content?: string;
	  }
	| {
			kind: "folder";
			id: string;
			name: string;
			children: VFSEntry[];
	  };

// ---- legacy compat re-export (used by getFileById) ----
export interface VirtualFile {
	id: string;
	name: string;
	type: FileType;
	icon: LucideIcon;
	slug: string;
	pageTitle?: string;
	description?: string;
	contentUrl: string;
}

/**
 * Folder identifiers matching desktop folder apps.
 */
export type FolderId = "projects" | "competitions";

function describeSeason(season: CompetitionSeason): string {
	const count = season.results.length;
	const events = [...new Set(season.results.map((r) => COMPETITION_SERIES[r.series].name))];
	return `Jackson Stephens's ${season.id} competition results: ${count} ${count === 1 ? "event" : "events"} (${events.join(", ")}).`;
}

/**
 * Competition results and event write-ups — mirrors terminal VFS at /competitions/.
 * Built from src/lib/portfolio/competitions.ts.
 */
const COMPETITIONS_TREE: VFSEntry[] = [
	...COMPETITION_SEASONS.map(
		(season): VFSEntry => ({
			kind: "folder",
			id: `season-${season.id}`,
			name: season.id,
			children: [
				{
					kind: "file",
					id: `comp-${season.id}-results`,
					name: "results.txt",
					type: "txt",
					icon: FileText,
					slug: seasonSlug(season.id),
					pageTitle: `${season.id} Competition Results`,
					description: describeSeason(season),
					contentUrl: seasonReadme(season.id),
				},
			],
		}),
	),
	{
		kind: "folder",
		id: "competition-events",
		name: "events",
		children: COMPETITION_SERIES_ORDER.map((seriesId): VFSEntry => {
			const series = COMPETITION_SERIES[seriesId];
			return {
				kind: "file",
				id: `file.${seriesId}`,
				name: series.fileName,
				type: "md",
				icon: FileText,
				slug: seriesId,
				pageTitle: series.name,
				description: series.summary,
				contentUrl: series.readme,
			};
		}),
	},
];

/**
 * Projects — mirrors terminal VFS at /projects/.
 * Built from src/lib/portfolio/projects.ts.
 */
const PROJECTS_TREE: VFSEntry[] = [
	...PROJECTS.map(
		(project): VFSEntry => ({
			kind: "file",
			id: `file.${project.slug}`,
			name: project.fileName,
			type: "md",
			icon: FileText,
			slug: project.slug,
			pageTitle: `${project.name} · ${project.tagline}`,
			description: `${project.name}: ${project.blurb.split(". ")[0]}.`,
			contentUrl: project.readme,
		}),
	),
	{
		kind: "folder",
		id: "projects-archive",
		name: "archive",
		children: [
			{
				kind: "file",
				id: "file.earlier-work",
				name: "earlier-work.md",
				type: "md",
				icon: FileText,
				slug: "earlier-work",
				pageTitle: "Earlier Work",
				description:
					"Earlier coursework and personal projects: reverse engineering, web penetration testing, networking labs, and a Raspberry Pi camera.",
				contentUrl: ARCHIVE_README,
			},
		],
	},
];

/**
 * VFS Registry mapping folder IDs to their entry trees.
 */
export const VFS_REGISTRY: Record<FolderId, VFSEntry[]> = {
	projects: PROJECTS_TREE,
	competitions: COMPETITIONS_TREE,
};

/**
 * Get the entry tree for a folder.
 */
export function getEntriesForFolder(folderId: FolderId): VFSEntry[] {
	return VFS_REGISTRY[folderId] ?? [];
}

// ---- legacy helpers (still used by some callers) ----

export function getFilesForFolder(folderId: FolderId): VirtualFile[] {
	// Flatten all files from the tree for backward compat
	return getFilesFromEntries(VFS_REGISTRY[folderId] ?? []);
}

export function getFileById(fileId: string): VirtualFile | undefined {
	for (const entries of Object.values(VFS_REGISTRY)) {
		const found = findFile(entries, fileId);
		if (found) return found;
	}
	return undefined;
}

function findFile(entries: VFSEntry[], id: string): VirtualFile | undefined {
	for (const e of entries) {
		if (e.kind === "file" && e.id === id && e.contentUrl) {
			return toVirtualFile(e, e.contentUrl);
		}
		if (e.kind === "folder") {
			const found = findFile(e.children, id);
			if (found) return found;
		}
	}
	return undefined;
}

function toVirtualFile(e: VFSEntry & { kind: "file" }, contentUrl: string): VirtualFile {
	return {
		id: e.id,
		name: e.name,
		type: e.type,
		icon: e.icon,
		slug: e.slug,
		pageTitle: e.pageTitle,
		description: e.description,
		contentUrl,
	};
}

/**
 * Find the file and its root folder for a content URL (e.g. "/readmes/rmccdc.md").
 */
export function findFileByContentUrl(
	contentUrl: string,
): { folderId: FolderId; file: VirtualFile } | undefined {
	for (const [folderId, entries] of Object.entries(VFS_REGISTRY) as [FolderId, VFSEntry[]][]) {
		const file = getFilesFromEntries(entries).find((f) => f.contentUrl === contentUrl);
		if (file) return { folderId, file };
	}
	return undefined;
}

/**
 * Find a file by its URL slug within a root folder.
 */
export function findFileBySlug(folderId: FolderId, slug: string): VirtualFile | undefined {
	return getFilesFromEntries(VFS_REGISTRY[folderId] ?? []).find((f) => f.slug === slug);
}

function getFilesFromEntries(entries: VFSEntry[]): VirtualFile[] {
	const result: VirtualFile[] = [];
	for (const e of entries) {
		if (e.kind === "file" && e.contentUrl) {
			result.push(toVirtualFile(e, e.contentUrl));
		} else if (e.kind === "folder") {
			result.push(...getFilesFromEntries(e.children));
		}
	}
	return result;
}

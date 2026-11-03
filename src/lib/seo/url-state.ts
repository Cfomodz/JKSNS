// Maps URL search params to initial system state for SSR

import { getFileById, getFilesForFolder } from "@/os/filesystem/files";
import {
	AppID,
	AUTO_FULLSCREEN_APPS,
	DEFAULT_WINDOW_SIZES,
	MAXIMIZED_APPS,
	type WindowInstance,
	type WindowProps,
} from "@/os/store/types";

/**
 * URL slug to AppID mapping.
 * Keep slugs SEO-friendly (lowercase, hyphenated).
 */
export const APP_SLUG_MAP: Record<string, AppID> = {
	terminal: AppID.Terminal,
	about: AppID.About,
	settings: AppID.Settings,
	browser: AppID.Browser,
	projects: AppID.FolderProjects,
	experience: AppID.FolderExperience,
	markdown: AppID.MarkdownViewer,
};

/**
 * Reverse mapping: AppID to URL slug.
 * Used for generating canonical URLs.
 */
export const APP_ID_TO_SLUG: Record<AppID, string> = {
	[AppID.Terminal]: "terminal",
	[AppID.About]: "about",
	[AppID.Settings]: "settings",
	[AppID.Browser]: "browser",
	[AppID.FolderProjects]: "projects",
	[AppID.FolderExperience]: "experience",
	[AppID.MarkdownViewer]: "markdown",
};

/**
 * File ID slug mapping for SEO-friendly URLs.
 * Maps URL slugs to VFS file IDs.
 */
export const FILE_SLUG_MAP: Record<string, string> = Object.fromEntries(
	[...getFilesForFolder("projects"), ...getFilesForFolder("competitions")].map((file) => [
		file.slug,
		file.id,
	]),
);

/**
 * Reverse mapping: File ID to URL slug.
 */
export const FILE_ID_TO_SLUG: Record<string, string> = Object.fromEntries(
	Object.entries(FILE_SLUG_MAP).map(([slug, id]) => [id, slug]),
);

/**
 * URL search params type for the page.
 */
export interface PageSearchParams {
	app?: string;
	file?: string;
}

/**
 * Initial hydration state derived from URL.
 */
export interface HydrationState {
	windows: WindowInstance[];
	activeWindowId: AppID | null;
	fullscreenWindowId: AppID | null;
}

/**
 * Default viewport for SSR window positioning.
 */
const SSR_VIEWPORT = { width: 1440, height: 900 };
const SYSTEM_BAR_HEIGHT = 0;
const DOCK_HEIGHT = 80;
const MAXIMIZED_PADDING = 32;

/**
 * Calculate centered window position for SSR.
 */
function calculateSSRPosition(width: number, height: number): { x: number; y: number } {
	const availableHeight = SSR_VIEWPORT.height - SYSTEM_BAR_HEIGHT - DOCK_HEIGHT;
	return {
		x: Math.max(16, (SSR_VIEWPORT.width - width) / 2),
		y: Math.max(SYSTEM_BAR_HEIGHT + 8, SYSTEM_BAR_HEIGHT + (availableHeight - height) / 2),
	};
}

/**
 * Calculate maximized window size for SSR.
 */
function calculateSSRMaximizedSize(): { width: number; height: number } {
	return {
		width: SSR_VIEWPORT.width - MAXIMIZED_PADDING * 2,
		height: SSR_VIEWPORT.height - SYSTEM_BAR_HEIGHT - DOCK_HEIGHT - MAXIMIZED_PADDING,
	};
}

/**
 * Parse URL search params into initial system state.
 *
 * @param searchParams - URL search parameters from Next.js
 * @returns Initial state for Zustand store hydration
 *
 * @example
 * // /?app=about
 * parseURLToState({ app: 'about' })
 * // Returns state with About window open and focused
 *
 * @example
 * // /?app=markdown&file=rmccdc
 * parseURLToState({ app: 'markdown', file: 'rmccdc' })
 * // Returns state with MarkdownViewer showing rmccdc.md
 */
export function parseURLToState(searchParams: PageSearchParams): HydrationState {
	const emptyState: HydrationState = {
		windows: [],
		activeWindowId: null,
		fullscreenWindowId: null,
	};

	const appSlug = searchParams.app?.toLowerCase();
	if (!appSlug) {
		return emptyState;
	}

	const appId = APP_SLUG_MAP[appSlug];
	if (!appId) {
		return emptyState;
	}

	// Build window props based on app type
	let windowProps: WindowProps | undefined;

	// Handle markdown viewer with file param
	if (appId === AppID.MarkdownViewer && searchParams.file) {
		const fileSlug = searchParams.file.toLowerCase();
		const fileId = FILE_SLUG_MAP[fileSlug];
		const file = fileId ? getFileById(fileId) : undefined;

		if (file) {
			windowProps = {
				url: file.contentUrl,
				title: file.name,
			};
		} else {
			// Invalid file, return empty state
			return emptyState;
		}
	}

	// Handle folder apps
	if (appId === AppID.FolderProjects) {
		windowProps = { folderId: "projects" };
	} else if (appId === AppID.FolderExperience) {
		windowProps = { folderId: "competitions" };
	}

	// Determine window sizing
	const isMaximized = MAXIMIZED_APPS.has(appId);
	const defaultSize = DEFAULT_WINDOW_SIZES[appId];
	const size = isMaximized ? calculateSSRMaximizedSize() : defaultSize;

	const position = isMaximized
		? { x: MAXIMIZED_PADDING, y: SYSTEM_BAR_HEIGHT + MAXIMIZED_PADDING / 2 }
		: calculateSSRPosition(size.width, size.height);

	const shouldAutoFullscreen = AUTO_FULLSCREEN_APPS.has(appId);

	const window: WindowInstance = {
		id: appId,
		status: "open",
		position,
		size,
		props: windowProps,
		openedAt: Date.now(),
	};

	return {
		windows: [window],
		activeWindowId: appId,
		fullscreenWindowId: shouldAutoFullscreen ? appId : null,
	};
}

/**
 * Generate canonical URL for a given app state.
 *
 * @param baseUrl - The base domain URL
 * @param appId - Optional app ID
 * @param fileId - Optional file ID (for markdown viewer)
 * @returns Canonical URL string
 */
export function generateCanonicalURL(
	baseUrl: string,
	appId?: AppID | null,
	fileId?: string | null,
): string {
	if (!appId) {
		return baseUrl;
	}

	const appSlug = APP_ID_TO_SLUG[appId];
	if (!appSlug) {
		return baseUrl;
	}

	// Handle markdown viewer with file
	if (appId === AppID.MarkdownViewer && fileId) {
		const fileSlug = FILE_ID_TO_SLUG[fileId];
		if (fileSlug) {
			return `${baseUrl}?app=markdown&file=${fileSlug}`;
		}
	}

	return `${baseUrl}?app=${appSlug}`;
}

/**
 * Get all indexable URLs for sitemap generation.
 * Returns URLs for all apps and markdown files.
 */
export function getAllIndexableURLs(baseUrl: string): string[] {
	const urls: string[] = [baseUrl]; // Root URL

	// Add app URLs (excluding markdown viewer, which needs file param)
	const indexableApps: AppID[] = [
		AppID.About,
		AppID.Terminal,
		AppID.FolderProjects,
		AppID.FolderExperience,
	];

	for (const appId of indexableApps) {
		urls.push(generateCanonicalURL(baseUrl, appId));
	}

	// Add markdown file URLs
	for (const slug of Object.keys(FILE_SLUG_MAP)) {
		urls.push(`${baseUrl}?app=markdown&file=${slug}`);
	}

	return urls;
}

// Maps clean URL paths to app state and vice versa

import {
	type FolderId,
	findFileByContentUrl,
	findFileBySlug,
	getFilesForFolder,
} from "@/os/filesystem/files";
import {
	AppID,
	AUTO_FULLSCREEN_APPS,
	DEFAULT_WINDOW_SIZES,
	MAXIMIZED_APPS,
	type WindowInstance,
	type WindowProps,
} from "@/os/store/types";
import type { HydrationState } from "./url-state";

/**
 * Route configuration for static paths.
 */
interface StaticRouteConfig {
	appId: AppID;
	props?: WindowProps;
}

/**
 * Static route mappings (paths without dynamic segments).
 */
const STATIC_ROUTES: Record<string, StaticRouteConfig> = {
	"/about": { appId: AppID.About },
	"/resume": {
		appId: AppID.MarkdownViewer,
		props: { url: "/readmes/resume.md", title: "Resume" },
	},
	"/projects": { appId: AppID.FolderProjects, props: { folderId: "projects" } },
	"/experience": { appId: AppID.FolderExperience, props: { folderId: "competitions" } },
};

/**
 * URL prefix for each desktop folder. The Competitions folder keeps its
 * original /experience URL.
 */
const FOLDER_ROUTE_PREFIX: Record<FolderId, string> = {
	projects: "/projects",
	competitions: "/experience",
};

/**
 * Slug → file ID maps, derived from the VFS so every file in a desktop
 * folder gets a route without a second registry to keep in sync.
 */
function buildSlugMap(folderId: FolderId): Record<string, string> {
	return Object.fromEntries(getFilesForFolder(folderId).map((file) => [file.slug, file.id]));
}

const PROJECT_FILE_SLUGS: Record<string, string> = buildSlugMap("projects");
const EXPERIENCE_FILE_SLUGS: Record<string, string> = buildSlugMap("competitions");

/**
 * Old URLs for the competition pages, which used to live under /projects.
 */
const LEGACY_COMPETITION_SLUGS = new Set(["rmccdc", "nccdc", "cyberforce", "sandia-hackathon"]);

/**
 * Reverse mapping: AppID to canonical path.
 */
const APP_TO_PATH: Record<AppID, string> = {
	[AppID.About]: "/about",
	[AppID.Terminal]: "/", // Terminal doesn't have a dedicated route
	[AppID.Settings]: "/", // Settings doesn't have a dedicated route
	[AppID.Browser]: "/", // Browser doesn't have a dedicated route
	[AppID.FolderProjects]: "/projects",
	[AppID.FolderExperience]: "/experience",
	[AppID.MarkdownViewer]: "/", // Needs file context to determine path
};

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
 * Create a window instance for a given app and props.
 */
function createWindowForState(appId: AppID, props?: WindowProps): WindowInstance {
	const isMaximized = MAXIMIZED_APPS.has(appId);
	const defaultSize = DEFAULT_WINDOW_SIZES[appId];
	const size = isMaximized ? calculateSSRMaximizedSize() : defaultSize;

	const position = isMaximized
		? { x: MAXIMIZED_PADDING, y: SYSTEM_BAR_HEIGHT + MAXIMIZED_PADDING / 2 }
		: calculateSSRPosition(size.width, size.height);

	return {
		id: appId,
		status: "open",
		position,
		size,
		props,
		openedAt: Date.now(),
	};
}

/**
 * Parse a URL pathname into hydration state.
 *
 * @param pathname - The URL pathname (e.g., "/projects/yield")
 * @returns HydrationState for store initialization
 */
export function parsePathToState(pathname: string): HydrationState {
	const emptyState: HydrationState = {
		windows: [],
		activeWindowId: null,
		fullscreenWindowId: null,
	};

	// Normalize pathname
	const normalizedPath = pathname.toLowerCase().replace(/\/$/, "") || "/";

	// Check static routes first
	if (normalizedPath === "/") {
		return emptyState;
	}

	const staticRoute = STATIC_ROUTES[normalizedPath];
	if (staticRoute) {
		const window = createWindowForState(staticRoute.appId, staticRoute.props);
		const shouldAutoFullscreen = AUTO_FULLSCREEN_APPS.has(staticRoute.appId);

		return {
			windows: [window],
			activeWindowId: staticRoute.appId,
			fullscreenWindowId: shouldAutoFullscreen ? staticRoute.appId : null,
		};
	}

	// Check dynamic routes
	const segments = normalizedPath.split("/").filter(Boolean);

	// /projects/[slug] and /experience/[slug] routes
	if (segments.length === 2 && segments[1]) {
		const folderId = getFolderFromPath(normalizedPath);
		const file = folderId ? findFileBySlug(folderId, segments[1]) : undefined;
		if (file) {
			const window = createWindowForState(AppID.MarkdownViewer, {
				url: file.contentUrl,
				title: file.name,
			});
			return {
				windows: [window],
				activeWindowId: AppID.MarkdownViewer,
				fullscreenWindowId: AUTO_FULLSCREEN_APPS.has(AppID.MarkdownViewer)
					? AppID.MarkdownViewer
					: null,
			};
		}
	}

	// No matching route - return empty state
	return emptyState;
}

/**
 * Get the canonical URL path for an app and optional window props.
 *
 * @param appId - The application ID
 * @param props - Optional window props (for file-based apps)
 * @returns The canonical URL path
 */
export function getCanonicalPath(appId: AppID | null, props?: WindowProps): string {
	if (!appId) {
		return "/";
	}

	// For MarkdownViewer, determine path from file URL
	if (appId === AppID.MarkdownViewer && props?.url) {
		if (props.url === "/readmes/resume.md") {
			return "/resume";
		}
		const match = findFileByContentUrl(props.url);
		return match ? `${FOLDER_ROUTE_PREFIX[match.folderId]}/${match.file.slug}` : "/";
	}

	return APP_TO_PATH[appId] ?? "/";
}

/**
 * Convert a window state to a canonical URL path.
 * Used by URL sync to update browser URL when window state changes.
 *
 * @param window - The window instance
 * @returns The canonical URL path
 */
export function windowToPath(window: WindowInstance | null): string {
	if (!window) {
		return "/";
	}
	return getCanonicalPath(window.id, window.props);
}

/**
 * Get the legacy redirect path for query-parameter URLs.
 * Returns null if the legacy URL is invalid.
 *
 * @param appSlug - The app slug from ?app= param
 * @param fileSlug - The file slug from ?file= param
 * @returns The canonical path or null
 */
export function getLegacyRedirectPath(appSlug: string, fileSlug?: string): string | null {
	const normalizedApp = appSlug.toLowerCase();
	const normalizedFile = fileSlug?.toLowerCase();

	// Direct app mappings
	const appMappings: Record<string, string> = {
		about: "/about",
		resume: "/resume",
		rmccdc: "/experience/rmccdc",
		nccdc: "/experience/nccdc",
		cyberforce: "/experience/cyberforce",
		terminal: "/", // No dedicated route
		settings: "/", // No dedicated route
		projects: "/projects",
		experience: "/experience",
		// Legacy folder app IDs
		"folder-projects": "/projects",
		"folder-experience": "/experience",
	};

	// Handle markdown viewer with file param
	if (normalizedApp === "markdown" && normalizedFile) {
		// Competition pages used to live under /projects
		if (LEGACY_COMPETITION_SLUGS.has(normalizedFile)) {
			return normalizedFile === "sandia-hackathon"
				? "/experience/sandia"
				: `/experience/${normalizedFile}`;
		}
		// Check project files
		if (PROJECT_FILE_SLUGS[normalizedFile]) {
			return `/projects/${normalizedFile}`;
		}
		// Check experience files
		if (EXPERIENCE_FILE_SLUGS[normalizedFile]) {
			return `/experience/${normalizedFile}`;
		}
		// Check special files
		if (normalizedFile === "resume") {
			return "/resume";
		}
		// Unknown file
		return null;
	}

	return appMappings[normalizedApp] ?? null;
}

/**
 * Get all valid project file slugs for dynamic route generation.
 */
export function getProjectFileSlugs(): string[] {
	return Object.keys(PROJECT_FILE_SLUGS);
}

/**
 * Get all valid experience file slugs for dynamic route generation.
 */
export function getExperienceFileSlugs(): string[] {
	return Object.keys(EXPERIENCE_FILE_SLUGS);
}

/**
 * Check if a project slug is valid (either an app or a file).
 */
export function isValidProjectSlug(slug: string): boolean {
	return slug in PROJECT_FILE_SLUGS;
}

/**
 * Check if an experience slug is valid.
 */
export function isValidExperienceSlug(slug: string): boolean {
	return slug in EXPERIENCE_FILE_SLUGS;
}

/**
 * Get file metadata for a project slug.
 */
export function getProjectFileBySlug(slug: string): RoutedFile | null {
	return describeFile("projects", slug);
}

/**
 * Get file metadata for an experience slug.
 */
export function getExperienceFileBySlug(slug: string): RoutedFile | null {
	return describeFile("competitions", slug);
}

/**
 * Get all indexable paths for sitemap generation.
 */
export function getAllCanonicalPaths(): string[] {
	const paths: string[] = ["/", "/about", "/resume", "/projects", "/experience"];

	// Add project file paths
	for (const slug of Object.keys(PROJECT_FILE_SLUGS)) {
		paths.push(`/projects/${slug}`);
	}

	// Add experience file paths
	for (const slug of Object.keys(EXPERIENCE_FILE_SLUGS)) {
		paths.push(`/experience/${slug}`);
	}

	return paths;
}

/**
 * Determine the folder type from a pathname.
 */
export function getFolderFromPath(pathname: string): FolderId | null {
	const segments = pathname.toLowerCase().split("/").filter(Boolean);
	if (segments[0] === "projects") return "projects";
	if (segments[0] === "experience") return "competitions";
	return null;
}

/**
 * A file reachable at /projects/<slug> or /experience/<slug>.
 */
export interface RoutedFile {
	fileId: string;
	contentUrl: string;
	/** Filename shown in the window title bar. */
	title: string;
	/** Title for <title> and OpenGraph. */
	pageTitle: string;
	description?: string;
}

function describeFile(folderId: FolderId, slug: string): RoutedFile | null {
	const file = findFileBySlug(folderId, slug);
	if (!file) return null;
	return {
		fileId: file.id,
		contentUrl: file.contentUrl,
		title: file.name,
		pageTitle: file.pageTitle ?? file.name,
		description: file.description,
	};
}

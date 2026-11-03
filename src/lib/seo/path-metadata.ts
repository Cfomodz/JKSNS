import type { Metadata } from "next";
import { SITE_CONFIG } from "./metadata";
import { getExperienceFileBySlug, getProjectFileBySlug, type RoutedFile } from "./path-routing";

/**
 * Route configuration for metadata generation.
 */
interface RouteMetadata {
	title: string;
	description: string;
	ogImage?: string;
}

/**
 * Default homepage metadata (extracted for type safety).
 */
const DEFAULT_METADATA: RouteMetadata = {
	title: `${SITE_CONFIG.name} | ${SITE_CONFIG.title}`,
	description: SITE_CONFIG.description,
};

/**
 * Static route metadata configurations.
 */
const ROUTE_METADATA: Record<string, RouteMetadata> = {
	"/": DEFAULT_METADATA,
	"/about": {
		title: "About",
		description:
			"About Jackson Stephens: security engineer and researcher. Collegiate cyber defense competitor (RMCCDC, National CCDC, DOE CyberForce) building AI-augmented security tools.",
	},
	"/resume": {
		title: "Resume",
		description:
			"Resume of Jackson Stephens: security engineering, incident response, CTF auto-solving, agent governance, and competition results.",
	},
	"/projects": {
		title: "Projects",
		description:
			"Projects by Jackson Stephens: KRAKEN (autonomous CTF solver), claude_preflight (governed coding agents), distillr (grounded daily digests), and JSOS.",
	},
	"/experience": {
		title: "Competitions",
		description:
			"Competition history of Jackson Stephens by season: CCDC, DOE CyberForce, Sandia National Laboratories, and CTFs including KalmarCTF and BYU EOS CTF.",
	},
};

/**
 * Generate the canonical URL for a given path.
 */
function getCanonicalUrl(path: string): string {
	const normalizedPath = path === "/" ? "" : path;
	return `${SITE_CONFIG.baseUrl}${normalizedPath}`;
}

/**
 * Build complete metadata object from route metadata.
 */
function buildMetadata(path: string, meta: RouteMetadata): Metadata {
	const canonicalUrl = getCanonicalUrl(path);
	const ogImage = meta.ogImage ?? SITE_CONFIG.ogImage;

	return {
		title: meta.title,
		description: meta.description,
		alternates: {
			canonical: canonicalUrl,
		},
		openGraph: {
			title: `${meta.title} | ${SITE_CONFIG.siteName}`,
			description: meta.description,
			url: canonicalUrl,
			siteName: SITE_CONFIG.siteName,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: `${meta.title} - ${SITE_CONFIG.siteName}`,
				},
			],
			type: "website",
			locale: "en_US",
		},
		twitter: {
			card: "summary_large_image",
			title: `${meta.title} | ${SITE_CONFIG.siteName}`,
			description: meta.description,
			images: [ogImage],
		},
	};
}

function fileMetadata(file: RoutedFile): RouteMetadata {
	return {
		title: file.pageTitle,
		description: file.description ?? SITE_CONFIG.description,
	};
}

/**
 * Generate metadata for a route.
 *
 * @param path - The route path (e.g., "/about", "/projects/project-kraken")
 * @returns Next.js Metadata object
 */
export function generatePathMetadata(path: string): Metadata {
	const normalizedPath = path.toLowerCase().replace(/\/$/, "") || "/";

	const staticMeta = ROUTE_METADATA[normalizedPath];
	if (staticMeta) {
		return buildMetadata(normalizedPath, staticMeta);
	}

	const projectSlug = normalizedPath.match(/^\/projects\/(.+)$/)?.[1];
	const projectFile = projectSlug ? getProjectFileBySlug(projectSlug) : null;
	if (projectFile) {
		return buildMetadata(normalizedPath, fileMetadata(projectFile));
	}

	const experienceSlug = normalizedPath.match(/^\/experience\/(.+)$/)?.[1];
	const experienceFile = experienceSlug ? getExperienceFileBySlug(experienceSlug) : null;
	if (experienceFile) {
		return buildMetadata(normalizedPath, fileMetadata(experienceFile));
	}

	return buildMetadata("/", DEFAULT_METADATA);
}

/**
 * Generate metadata for a project file route.
 *
 * @param slug - The project file slug
 * @returns Next.js Metadata object or null if invalid slug
 */
export function generateProjectFileMetadata(slug: string): Metadata | null {
	const file = getProjectFileBySlug(slug);
	return file ? buildMetadata(`/projects/${slug}`, fileMetadata(file)) : null;
}

/**
 * Generate metadata for an experience (competitions) file route.
 *
 * @param slug - The experience file slug
 * @returns Next.js Metadata object or null if invalid slug
 */
export function generateExperienceFileMetadata(slug: string): Metadata | null {
	const file = getExperienceFileBySlug(slug);
	return file ? buildMetadata(`/experience/${slug}`, fileMetadata(file)) : null;
}

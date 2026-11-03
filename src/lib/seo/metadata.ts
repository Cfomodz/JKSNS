import type { Metadata } from "next";
import { getFileById } from "@/os/filesystem/files";
import { AppID } from "@/os/store/types";
import {
	APP_SLUG_MAP,
	FILE_SLUG_MAP,
	generateCanonicalURL,
	type PageSearchParams,
} from "./url-state";

export const SITE_CONFIG = {
	name: "Jackson Stephens",
	title: "Security Engineer & Researcher",
	siteName: "JSOS",
	baseUrl: "https://jackson.stephens.sh",
	description:
		"Security engineer and researcher. Collegiate cyber defense competitor (RMCCDC, National CCDC, DOE CyberForce) building AI-augmented security tools: KRAKEN, claude_preflight, and distillr.",
	ogImage: "/assets/web_assets/og.png",
	twitterHandle: "@JKSNS",
} as const;

const APP_METADATA: Record<AppID, { title: string; description: string; ogImage?: string }> = {
	[AppID.About]: {
		title: "About",
		description:
			"About Jackson Stephens: security engineer and researcher, cyber defense competitor, and builder of AI-augmented security tools.",
	},
	[AppID.Terminal]: {
		title: "Terminal",
		description:
			"JSOS terminal: browse projects and competition results from a virtual filesystem, or play Snake, Tetris, and 2048.",
	},
	[AppID.Settings]: {
		title: "Settings",
		description: "JSOS settings: wallpaper, dock, icon, and terminal color preferences.",
	},
	[AppID.FolderProjects]: {
		title: "Projects",
		description:
			"Projects by Jackson Stephens: KRAKEN, claude_preflight, distillr, JSOS, and earlier work.",
	},
	[AppID.FolderExperience]: {
		title: "Competitions",
		description:
			"Competition results by season: CCDC, DOE CyberForce, Sandia National Laboratories, and CTFs.",
	},
	[AppID.Browser]: {
		title: "Blog",
		description: "Technical reports and write-ups by Jackson Stephens.",
	},
	[AppID.MarkdownViewer]: {
		title: "Document",
		description: "Document viewer.",
	},
};

export function generatePageMetadata(searchParams: PageSearchParams): Metadata {
	const appSlug = searchParams.app?.toLowerCase();
	const fileSlug = searchParams.file?.toLowerCase();

	if (!appSlug) {
		return {
			title: `${SITE_CONFIG.name} | ${SITE_CONFIG.title}`,
			description: SITE_CONFIG.description,
			alternates: {
				canonical: SITE_CONFIG.baseUrl,
			},
			openGraph: {
				title: `${SITE_CONFIG.name} | ${SITE_CONFIG.title}`,
				description: SITE_CONFIG.description,
				url: SITE_CONFIG.baseUrl,
				siteName: SITE_CONFIG.siteName,
				images: [
					{
						url: SITE_CONFIG.ogImage,
						width: 1200,
						height: 630,
						alt: `${SITE_CONFIG.name} - ${SITE_CONFIG.siteName}`,
					},
				],
				type: "website",
				locale: "en_US",
			},
			twitter: {
				card: "summary_large_image",
				title: `${SITE_CONFIG.name} | ${SITE_CONFIG.title}`,
				description: SITE_CONFIG.description,
				images: [SITE_CONFIG.ogImage],
			},
		};
	}

	const appId = APP_SLUG_MAP[appSlug];
	if (!appId) {
		return generatePageMetadata({});
	}

	const appMeta = APP_METADATA[appId];
	let title = appMeta.title;
	let description = appMeta.description;
	const ogImage = appMeta.ogImage ?? SITE_CONFIG.ogImage;
	let fileId: string | null = null;

	if (appId === AppID.MarkdownViewer && fileSlug) {
		fileId = FILE_SLUG_MAP[fileSlug] ?? null;
		const file = fileId ? getFileById(fileId) : undefined;

		if (file && fileId) {
			title = file.pageTitle ?? file.name;
			if (file.description) {
				description = file.description;
			}
		}
	}

	const canonicalUrl = generateCanonicalURL(SITE_CONFIG.baseUrl, appId, fileId);

	return {
		title,
		description,
		alternates: {
			canonical: canonicalUrl,
		},
		openGraph: {
			title: `${title} | ${SITE_CONFIG.siteName}`,
			description,
			url: canonicalUrl,
			siteName: SITE_CONFIG.siteName,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: `${title} - ${SITE_CONFIG.siteName}`,
				},
			],
			type: "website",
			locale: "en_US",
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} | ${SITE_CONFIG.siteName}`,
			description,
			images: [ogImage],
		},
	};
}

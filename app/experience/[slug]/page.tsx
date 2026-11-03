import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	generateExperienceFileMetadata,
	getExperienceFileBySlug,
	getExperienceFileSlugs,
	parsePathToState,
} from "@/lib/seo";
import { OSShell } from "@/os/ssr";

interface ExperienceFilePageProps {
	params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
	return getExperienceFileSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ExperienceFilePageProps): Promise<Metadata> {
	const { slug } = await params;
	return generateExperienceFileMetadata(slug) ?? {};
}

/**
 * Competition page — /experience/<slug>
 *
 * Opens a season's results or an event write-up in the Markdown Viewer,
 * server-rendered for crawlers.
 */
export default async function ExperienceFilePage({ params }: ExperienceFilePageProps) {
	const { slug } = await params;
	if (!getExperienceFileBySlug(slug)) notFound();

	const initialState = parsePathToState(`/experience/${slug}`);
	return <OSShell initialState={initialState} hasContentH1 />;
}

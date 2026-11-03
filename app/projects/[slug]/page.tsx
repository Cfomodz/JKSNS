import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	generateProjectFileMetadata,
	getProjectFileBySlug,
	getProjectFileSlugs,
	parsePathToState,
} from "@/lib/seo";
import { OSShell } from "@/os/ssr";

interface ProjectFilePageProps {
	params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
	return getProjectFileSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectFilePageProps): Promise<Metadata> {
	const { slug } = await params;
	return generateProjectFileMetadata(slug) ?? {};
}

/**
 * Project page — /projects/<slug>
 *
 * Opens the project's write-up in the Markdown Viewer, server-rendered for crawlers.
 */
export default async function ProjectFilePage({ params }: ProjectFilePageProps) {
	const { slug } = await params;
	const file = getProjectFileBySlug(slug);
	if (!file) notFound();

	const initialState = parsePathToState(`/projects/${slug}`);
	return <OSShell initialState={initialState} fileId={file.fileId} hasContentH1 />;
}

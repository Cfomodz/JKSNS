"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";

import {
	ARCHIVE_PROJECTS,
	COMPETITION_SEASONS,
	type CompetitionSeason,
	FOCUS_AREAS,
	formatCompetitionResult,
	getResultsForProject,
	PROFILE_INTRO,
	PROFILE_PARAGRAPHS,
	PROJECTS,
	type Project,
} from "@/lib/portfolio";

import type { AboutTabId } from "./TabNavigation";

export interface TabContentProps {
	activeTab: AboutTabId;
}

const contentVariants = {
	initial: { opacity: 0, y: 8 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -8 },
};

export const TabContent = memo(function TabContent({ activeTab }: TabContentProps) {
	return (
		<div className="flex-1 overflow-auto p-5">
			<AnimatePresence mode="wait">
				<motion.div
					key={activeTab}
					variants={contentVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{ duration: 0.15, ease: "easeOut" }}
				>
					{activeTab === "overview" && <OverviewPanel />}
					{activeTab === "projects" && <ProjectsPanel />}
					{activeTab === "experience" && <ExperiencePanel />}
					{activeTab === "manual" && <ManualPanel />}
				</motion.div>
			</AnimatePresence>
		</div>
	);
});

function OverviewPanel() {
	const latest = COMPETITION_SEASONS[0];
	return (
		<div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" className="space-y-5">
			<h2 className="font-mono text-sm font-medium text-white/70">{"// Overview"}</h2>
			<div className="space-y-3 text-sm leading-relaxed text-white/60">
				<p>{PROFILE_INTRO}</p>
				{PROFILE_PARAGRAPHS.map((paragraph) => (
					<p key={paragraph}>{paragraph}</p>
				))}
			</div>

			<section className="space-y-2">
				<h3 className="text-[11px] font-medium uppercase tracking-wider text-white/30">
					Working on
				</h3>
				<ul className="space-y-1.5">
					{PROJECTS.map((project) => (
						<li key={project.slug} className="text-xs leading-relaxed text-white/50">
							<span className="font-mono text-white/75">{project.name}</span>
							<span className="text-white/30"> · </span>
							{project.tagline}
						</li>
					))}
				</ul>
			</section>

			{latest && (
				<section className="space-y-2">
					<h3 className="text-[11px] font-medium uppercase tracking-wider text-white/30">
						Latest result · {latest.id}
					</h3>
					<ul className="space-y-1.5">
						{latest.results.map((result) => (
							<li key={formatCompetitionResult(result)} className="text-xs text-white/50">
								{formatCompetitionResult(result)}
							</li>
						))}
					</ul>
				</section>
			)}

			<section className="space-y-2">
				<h3 className="text-[11px] font-medium uppercase tracking-wider text-white/30">Focus</h3>
				<div className="flex flex-wrap gap-1.5">
					{FOCUS_AREAS.map((area) => (
						<span
							key={area}
							className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-white/50"
						>
							{area}
						</span>
					))}
				</div>
			</section>
		</div>
	);
}

function ProjectsPanel() {
	return (
		<div role="tabpanel" id="panel-projects" aria-labelledby="tab-projects" className="space-y-4">
			<h2 className="font-mono text-sm font-medium text-white/70">{"// Projects"}</h2>
			<div className="space-y-3">
				{PROJECTS.map((project) => (
					<ProjectCard key={project.slug} project={project} />
				))}
			</div>

			<h2 className="pt-2 font-mono text-sm font-medium text-white/70">{"// Earlier work"}</h2>
			<ul className="space-y-2">
				{ARCHIVE_PROJECTS.map((project) => (
					<li key={project.name} className="text-xs leading-relaxed">
						<ExternalLink href={project.repoUrl}>{project.name}</ExternalLink>
						<span className="text-white/30"> · {project.year}</span>
						<p className="text-white/40">{project.blurb}</p>
					</li>
				))}
			</ul>
		</div>
	);
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			onClick={(e) => {
				// Framer-drag windows can swallow default <a> navigation; force the open.
				e.preventDefault();
				window.open(href, "_blank", "noopener,noreferrer");
			}}
			className="relative z-10 pointer-events-auto text-xs font-medium text-blue-400 hover:underline"
		>
			{children}
		</a>
	);
}

function ProjectCard({ project }: { project: Project }) {
	const results = getResultsForProject(project.slug);
	return (
		<div className="rounded-lg border border-white/[0.06] px-4 py-3">
			<div className="flex flex-wrap items-baseline gap-2">
				<span className="font-mono text-sm font-medium text-white/80">{project.name}</span>
				{project.version && (
					<span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/50">
						{project.version}
					</span>
				)}
				<span className="font-mono text-[10px] text-white/30">{project.updated}</span>
			</div>
			<p className="mt-1 text-xs font-medium text-white/60">{project.tagline}</p>
			<p className="mt-2 text-xs leading-relaxed text-white/40">{project.blurb}</p>
			<ul className="mt-2 space-y-1">
				{project.highlights.map((highlight) => (
					<li key={highlight} className="text-xs leading-relaxed text-white/45">
						<span className="mr-1.5 text-white/20">-</span>
						{highlight}
					</li>
				))}
			</ul>
			{results.length > 0 && (
				<p className="mt-2 text-[11px] text-white/35">
					Also in Competitions:{" "}
					{results.map(({ season, result }) => `${result.event} (${season})`).join(", ")}
				</p>
			)}
			<p className="mt-2 font-mono text-[10px] text-white/30">{project.stack.join(" · ")}</p>
			<div className="mt-3 flex flex-wrap gap-3">
				<ExternalLink href={project.repoUrl}>GitHub</ExternalLink>
				{project.paperUrl && <ExternalLink href={project.paperUrl}>Paper (PDF)</ExternalLink>}
			</div>
		</div>
	);
}

function ExperiencePanel() {
	return (
		<div
			role="tabpanel"
			id="panel-experience"
			aria-labelledby="tab-experience"
			className="space-y-3"
		>
			{COMPETITION_SEASONS.map((season, i) => (
				<SeasonCard key={season.id} season={season} defaultOpen={i <= 1} />
			))}
		</div>
	);
}

function SeasonCard({ season, defaultOpen }: { season: CompetitionSeason; defaultOpen: boolean }) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div className="rounded-lg border border-white/[0.06] overflow-hidden">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.03]"
			>
				<span className="text-xs font-medium text-white/80">
					{season.id}
					<span className="ml-2 font-normal text-white/30">
						{season.results.length} {season.results.length === 1 ? "event" : "events"}
					</span>
				</span>
				<span className="text-xs text-white/30 transition-transform" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>
					&#9654;
				</span>
			</button>
			{open && (
				<div className="border-t border-white/[0.06] px-4 py-3">
					<ul className="space-y-1.5">
						{season.results.map((result) => (
							<li key={formatCompetitionResult(result)} className="text-xs text-white/50">
								{formatCompetitionResult(result)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

function ManualPanel() {
	return (
		<div
			role="tabpanel"
			id="panel-manual"
			aria-labelledby="tab-manual"
			className="space-y-5"
		>
			{/* Quick Info Cards */}
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<ManualCard label="What is JSOS?" value="A portfolio that runs like an operating system. Open apps, explore folders, use the terminal." />
				<ManualCard label="Easter eggs?" value="A few... Explore! :)" />
				<ManualCard label="Built with" value="Next.js, TypeScript, Tailwind CSS, Framer Motion, Zustand" />
				<ManualCard
					label="Source code"
					value="github.com/JKSNS"
					href="https://github.com/JKSNS/JKSNS.github.io"
				/>
			</div>

			{/* Collapsible Legal Sections */}
			<ManualCollapsible title="Privacy Policy" subtitle="Effective March 22, 2026">
				<ManualParagraph title="Overview" text="This Privacy Policy explains how jackson.stephens.sh handles information. This is a personal portfolio with no commercial data collection. We take privacy seriously and collect as little as possible." />
				<ManualParagraph title="Automatically Collected" text="This site does not use third-party analytics or tracking scripts. No cookies are set for tracking or advertising purposes." />
				<ManualParagraph title="Browser Local Storage" text="Your interface preferences (such as wallpaper selection) are stored in your browser's Local Storage. This data never leaves your device, is not transmitted to any server, and is used solely to preserve your UI settings between visits. You can delete it at any time by clearing your browser's site data for this domain." />
				<ManualParagraph title="No Personal Data Collection" text="We do not collect, store, or process personally identifiable information such as names, email addresses, or IP addresses unless you voluntarily contact us." />
				<ManualParagraph title="Cookies" text="This site does not use cookies." />
				<ManualParagraph title="Third-Party Services" text="This site is hosted on GitHub Pages. GitHub may collect standard server-side access logs (IP address, request timestamp, browser user agent) as part of their infrastructure. No advertising networks, analytics platforms, or data brokers are used on this site." />
				<ManualParagraph title="Children's Privacy" text="This site is not directed at children under 13 and does not knowingly collect information from them." />
				<ManualParagraph title="Data Security" text="All traffic between your browser and this site is encrypted via HTTPS. Since we collect no personal data beyond Local Storage (which stays on your device), there is minimal data security risk from our side." />
				<ManualParagraph title="Your Rights" text="Since we collect no personal data, there is generally nothing to access, correct, or delete. You can clear Local Storage at any time in your browser settings. For any questions, contact jackson@stephens.sh." />
				<ManualParagraph title="Changes to This Policy" text="We may update this policy to reflect changes to the site. Any updates will be posted here with a revised effective date." />
			</ManualCollapsible>

			<ManualCollapsible title="Terms of Use" subtitle="Effective March 22, 2026">
				<ManualParagraph title="Overview" text="This website (jackson.stephens.sh) is a personal portfolio operated by Jackson Stephens. By accessing this site you agree to these terms. If you do not agree, do not use the site." />
				<ManualParagraph title="Permitted Use" text="You may access this site for personal, non-commercial purposes. You may view content, interact with the interface, and browse project documentation." />
				<div className="space-y-1">
					<h4 className="text-xs font-medium text-white/50">Prohibited Conduct</h4>
					<ul className="space-y-0.5 pl-3">
						{[
							"Use the site for any unlawful purpose.",
							"Attempt to probe, scan, or test vulnerabilities in the site or its infrastructure.",
							"Scrape, crawl, or otherwise extract content using automated means without prior written consent.",
							"Transmit spam, malware, or any malicious code through any interactive feature.",
							"Misrepresent your identity or affiliation.",
							"Interfere with or disrupt the site or servers connected to it.",
						].map((item) => (
							<li key={item} className="text-xs leading-relaxed text-white/40">
								<span className="mr-1.5 text-white/20">-</span>{item}
							</li>
						))}
					</ul>
				</div>
				<ManualParagraph title="Intellectual Property" text="All content on this site — including text, design, graphics, and code — is owned by or licensed to Jackson Stephens and protected by applicable intellectual property law. The source code is available publicly under its repository license. Nothing here transfers any ownership rights to you beyond the limited license to view and interact with the site." />
				<ManualParagraph title="Third-Party Links" text="This site may link to third-party services (GitHub, LinkedIn, etc.). We have no control over those sites and are not responsible for their content or practices." />
				<ManualParagraph title="Disclaimer of Warranties" text='This site is provided "as is" and "as available" without any warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the site will be uninterrupted, error-free, or free of harmful components.' />
				<ManualParagraph title="Limitation of Liability" text="To the fullest extent permitted by law, Jackson Stephens shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use this site." />
				<ManualParagraph title="Modifications" text="These terms may be updated at any time. Continued use of the site after changes are posted constitutes acceptance of the updated terms." />
				<ManualParagraph title="Governing Law" text="These terms are governed by the laws of the State of Utah, United States, without regard to conflict of law provisions." />
				<ManualParagraph title="Contact" text="jackson@stephens.sh" />
			</ManualCollapsible>
		</div>
	);
}

function ManualCard({ label, value, href }: { label: string; value: string; href?: string }) {
	return (
		<div className="rounded-lg bg-white/[0.04] px-4 py-3 transition-colors hover:bg-white/[0.06]">
			<p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-white/30">{label}</p>
			{href ? (
				<a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400/80 hover:text-blue-400 underline underline-offset-2">
					{value}
				</a>
			) : (
				<p className="text-sm leading-relaxed text-white/60">{value}</p>
			)}
		</div>
	);
}

function ManualCollapsible({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="rounded-lg border border-white/[0.06] overflow-hidden">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.03]"
			>
				<div>
					<h3 className="text-xs font-medium text-white/70">{title}</h3>
					<p className="text-[10px] text-white/30">{subtitle}</p>
				</div>
				<span className="text-xs text-white/30 transition-transform" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>
					&#9654;
				</span>
			</button>
			{open && (
				<div className="space-y-3 border-t border-white/[0.06] px-4 py-3">
					{children}
				</div>
			)}
		</div>
	);
}

function ManualParagraph({ title, text }: { title: string; text: string }) {
	return (
		<div className="space-y-1">
			<h4 className="text-sm font-medium text-white/50">{title}</h4>
			<p className="text-xs leading-relaxed text-white/40">{text}</p>
		</div>
	);
}

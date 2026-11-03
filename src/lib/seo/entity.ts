/**
 * Entity Identity Data — Single Source of Truth
 *
 * Centralizes all identity data for the portfolio owner.
 * Used by:
 * - Schema.org JSON-LD generation (Person, ProfilePage)
 * - SSR Entity Card (crawlable identity signals)
 * - ProfileSidebar component
 * - AboutSystemModal component
 *
 * This ensures consistency between structured data claims
 * and visible DOM content — critical for entity verification.
 */

import { FOCUS_AREAS } from "@/lib/portfolio";
import { SITE_CONFIG } from "./metadata";

/**
 * Social profile link configuration.
 */
export interface SocialProfile {
	platform: string;
	url: string;
	username: string;
	ariaLabel: string;
}

/**
 * Work experience entry.
 */
export interface WorkExperience {
	organization: string;
	organizationUrl?: string;
	role: string;
	startDate: string;
	endDate?: string;
	current: boolean;
}

/**
 * Education entry.
 */
export interface Education {
	institution: string;
	institutionUrl?: string;
	degree?: string;
	field?: string;
	graduationYear?: number;
}

/**
 * Complete entity identity data.
 */
export interface EntityData {
	// Core identity
	name: string;
	givenName: string;
	familyName: string;
	jobTitle: string;
	description: string;

	// Location
	location: string;
	timezone: string;

	// Contact
	email: string;
	url: string;

	// Images
	profileImage: string;
	ogImage: string;

	// Social profiles (used in sameAs schema)
	socialProfiles: SocialProfile[];

	// Professional
	currentEmployer: WorkExperience;
	education: Education[];

	// Skills/expertise (used in knowsAbout schema)
	knowsAbout: string[];
}

/**
 * The Entity — Jackson Stephens
 *
 * This constant is the canonical source for all identity data.
 * Any component or schema generator should reference this object.
 */
export const ENTITY: EntityData = {
	// Core identity
	name: "Jackson Stephens",
	givenName: "Jackson",
	familyName: "Stephens",
	jobTitle: "Security Engineer & Researcher",
	description: SITE_CONFIG.description,

	// Location
	location: "United States",
	timezone: "EST (UTC-5)",

	// Contact
	email: "jackson@stephens.sh",
	url: SITE_CONFIG.baseUrl,

	// Images
	profileImage: "/assets/profile_picture/pfp.png",
	ogImage: `${SITE_CONFIG.baseUrl}/assets/web_assets/og.png`,

	// Social profiles
	socialProfiles: [
		{
			platform: "GitHub",
			url: "https://github.com/JKSNS",
			username: "JKSNS",
			ariaLabel: "View GitHub profile",
		},
		{
			platform: "LinkedIn",
			url: "https://www.linkedin.com/in/profile-jackson-stephens/",
			username: "profile-jackson-stephens",
			ariaLabel: "View LinkedIn profile",
		},
		{
			platform: "Twitter",
			url: "https://twitter.com/JKSNS",
			username: "JKSNS",
			ariaLabel: "View Twitter profile",
		},
	],

	// Current employment. Leave organization empty to omit worksFor from the
	// Person schema and the SSR entity card.
	currentEmployer: {
		organization: "",
		organizationUrl: "",
		role: "Security Engineer & Researcher",
		startDate: "2024-04",
		current: true,
	},

	// Education. Empty entries are omitted from the Person schema.
	education: [],

	// Skills and expertise (shared with the About app's Focus list)
	knowsAbout: FOCUS_AREAS,
};

/**
 * Get social profile URLs for schema.org sameAs property.
 * Excludes internal links (like "Links" page).
 */
export function getSameAsUrls(): string[] {
	const externalPlatforms = ["GitHub", "LinkedIn", "Twitter"];
	return ENTITY.socialProfiles
		.filter((profile) => externalPlatforms.includes(profile.platform))
		.map((profile) => profile.url);
}

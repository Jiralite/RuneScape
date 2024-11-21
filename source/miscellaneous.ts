import { transformName } from "./utility/functions.js";

/**
 * Represents the options to provide for retrieving a player's avatar.
 */
export interface AvatarOptions {
	/**
	 * The player's name.
	 */
	name: string;
	/**
	 * The desired width.
	 *
	 * @remarks 100 is the maximum number the width abides by.
	 */
	width?: number;
	/**
	 * The desired height.
	 *
	 * @remarks 100 is the maximum number the height abides by.
	 */
	height?: number;
}

/**
 * Returns the avatar of a player.
 *
 * @param options - The options to provide
 * @returns The player's avatar link.
 */
export function avatar({ name, width, height }: AvatarOptions): string {
	const urlSearchParams = new URLSearchParams();

	if (typeof width === "number") {
		urlSearchParams.set("w", String(width));
	}

	if (typeof height === "number") {
		urlSearchParams.set("h", String(height));
	}

	return `https://secure.runescape.com/m=avatar-rs/${transformName(name, "%20")}/chat.png${
		String(urlSearchParams) ? `?${urlSearchParams}` : ""
	}`;
}

/**
 * Represents what may provide a clan's home page.
 */
export enum ClanPage {
	RuneInfo = "RuneInfo",
	RunePixels = "Runepixels",
	RuneScape = "RuneScape",
}

/**
 * Represents the options to provide for retrieving clan home pages.
 */
export interface ClanPageOptions {
	/**
	 * The clan.
	 */
	clan: string;
}

/**
 * Retrieve a clan's home pages.
 *
 * @param options - The options to provide
 * @returns An object containing sources to their links.
 */
export function clanPage({ clan }: ClanPageOptions): { [key in ClanPage]: string } {
	return {
		[ClanPage.RuneScape]: `https://services.runescape.com/m=clan-home/clan/${transformName(clan, "%20")}`,
		[ClanPage.RuneInfo]: `https://runeinfo.com/clan/${transformName(clan, "%20")}`,
		[ClanPage.RunePixels]: `https://runepixels.com/clans/${transformName(clan, "-")}`,
	};
}

/**
 * Represents what may provide a player's page.
 */
export enum PlayerPage {
	RuneInfo = "RuneInfo",
	RuneMetrics = "RuneMetrics",
	RunePixels = "Runepixels",
	RuneScape = "RuneScape",
	RuneTracker = "RuneTracker",
}

/**
 * Represents the options to provide for retrieving player pages.
 */
export interface PlayerPageOptions {
	/**
	 * The player's name.
	 */
	name: string;
}

/**
 * Retrieves a player's pages.
 *
 * @param options - The options to provide
 * @returns An object containing sources to their links.
 */
export function playerPage({ name }: PlayerPageOptions): { [key in PlayerPage]: string } {
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set("user1", transformName(name, "%20"));

	return {
		[PlayerPage.RuneScape]: `https://secure.runescape.com/m=hiscore/compare?${urlSearchParams}`,
		[PlayerPage.RuneMetrics]: `https://apps.runescape.com/runemetrics/app/overview/player/${transformName(
			name,
			"%20",
		)}`,
		[PlayerPage.RuneInfo]: `https://runeinfo.com/profile/${transformName(name, "%20")}`,
		[PlayerPage.RunePixels]: `https://runepixels.com/players/${transformName(name, "-")}`,
		[PlayerPage.RuneTracker]: `https://runetracker.org/track-${transformName(name, "+")}`,
	};
}

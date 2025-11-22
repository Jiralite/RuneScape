import { RuneScapeAPIError } from "./utility/error.js";
import { transformName } from "./utility/functions.js";
import { makeRequest } from "./utility/make-request.js";

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
	width?: number | undefined;
	/**
	 * The desired height.
	 *
	 * @remarks 100 is the maximum number the height abides by.
	 */
	height?: number | undefined;
}

/**
 * Returns the avatar of a player.
 *
 * @param options - The options to provide
 * @returns The player's avatar link.
 */
export function avatar({ name, width, height }: AvatarOptions): string {
	const urlSearchParams = new URLSearchParams();

	if (width !== undefined) {
		urlSearchParams.set("w", String(width));
	}

	if (height !== undefined) {
		urlSearchParams.set("h", String(height));
	}

	return `https://secure.runescape.com/m=avatar-rs/${transformName(name, "%20")}/chat.png${
		String(urlSearchParams) ? `?${urlSearchParams}` : ""
	}`;
}

/**
 * Returns a clan's motif.
 *
 * @param name - The name of a clan
 */
export function clanMotif(name: string): string {
	return `https://secure.runescape.com/m=avatar-rs/${transformName(name, "%20")}/clanmotif.png`;
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
	urlSearchParams.set("user1", name);

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

/**
 * Represents the options to provide for fetching the player count.
 */
export interface PlayerCountOptions {
	/**
	 * The abort signal for the fetch.
	 */
	abortSignal?: AbortSignal | undefined;
}

/**
 * Retrieves the total number of players online in RuneScape and OldSchool RuneScape.
 *
 * @param options - The options to provide
 * @returns The number of online players.
 */
export async function playerCount({ abortSignal }: PlayerCountOptions = {}): Promise<number> {
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set("varname", "iPlayerCount");
	urlSearchParams.set("callback", "jQuery000000000000000_0000000000");
	const url = `https://runescape.com/player_count.js?${urlSearchParams}` as const;
	const response = await makeRequest(url, abortSignal);

	if (!response.ok) {
		throw new RuneScapeAPIError("Error fetching the player count.", response.status, url);
	}

	const body = await response.text();
	return Number(body.slice(body.indexOf("(") + 1, body.indexOf(")")));
}

interface RawCreatedAccounts {
	accounts: number;
	accountsformatted: string;
}

/**
 * Represents the data of the amount of created accounts.
 */
export interface CreatedAccounts {
	/**
	 * The amount of created accounts.
	 */
	accounts: number;
	/**
	 * A string representation of {@link CreatedAccounts.accounts}, formatted with commas.
	 */
	accountsFormatted: string;
}

/**
 * Represents the options to provide for fetching the amount of created accounts.
 */
export interface CreatedAccountsOptions {
	/**
	 * The abort signal for the fetch.
	 */
	abortSignal?: AbortSignal | undefined;
}

/**
 * Retrieves the amount of created accounts.
 *
 * @param options - The options to provide
 * @returns An object with the created accounts data.
 */
export async function createdAccounts({
	abortSignal,
}: CreatedAccountsOptions = {}): Promise<CreatedAccounts> {
	const url = "https://secure.runescape.com/m=account-creation-reports/rsusertotal.ws" as const;
	const response = await makeRequest(url, abortSignal);

	if (!response.ok) {
		throw new RuneScapeAPIError(
			"Error fetching the amount of created accounts.",
			response.status,
			url,
		);
	}

	const body = (await response.json()) as RawCreatedAccounts;

	return {
		accounts: body.accounts,
		accountsFormatted: body.accountsformatted,
	};
}

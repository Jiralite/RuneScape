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
 * Retrieves a player's RuneMetrics page.
 *
 * @param playerName - The player name
 */
export function playerPageRuneMetrics(playerName: string): string {
	return `https://apps.runescape.com/runemetrics/app/overview/player/${transformName(
		playerName,
		"%20",
	)}`;
}

/**
 * Retrieves a player's Runepixels page.
 *
 * @param playerName - The player name
 */
export function playerPageRunepixels(playerName: string): string {
	return `https://runepixels.com/players/${transformName(playerName, "-")}`;
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

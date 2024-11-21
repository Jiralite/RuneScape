import { makeRequest } from "./utility/make-request.js";

interface RawPlayerDetail {
	clan?: string;
	isSuffix: boolean;
	name: string;
	recruiting?: boolean;
	title: string;
}

/**
 * Represents some basic information about a player.
 */
export interface PlayerDetail {
	/**
	 * The clan of the player.
	 */
	clan: string | null;
	/**
	 * Whether the title is suffixed.
	 *
	 * @remarks Since {@link PlayerDetail.title} appears to always be `null`, this also appears to always be `false`.
	 */
	isSuffix: boolean;
	/**
	 * The name of the player.
	 */
	name: string;
	/**
	 * Whether the player's clan is set to display that they are recruiting.
	 */
	recruiting: boolean | null;
	/**
	 * The title of the player.
	 *
	 * @remarks This appears to always be `null`.
	 */
	title: string | null;
}

/**
 * Represents the options to provide for fetching player profiles.
 */
export interface PlayerDetailsOptions {
	/**
	 * An array of player names.
	 */
	names: string[];
	/**
	 * The abort signal for the fetch.
	 */
	abortSignal?: AbortSignal | undefined;
}

/**
 * Returns player details.
 *
 * @param options - The options to provide
 * @returns An array containing the resulting player details.
 */
export async function playerDetails({
	names,
	abortSignal,
}: PlayerDetailsOptions): Promise<PlayerDetail[]> {
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set("names", JSON.stringify(names));
	urlSearchParams.set("callback", "jQuery000000000000000_0000000000");

	const response = await makeRequest(
		`https://secure.runescape.com/m=website-data/playerDetails.ws?${urlSearchParams}`,
		abortSignal,
	);

	const body = await response.text();
	const json: RawPlayerDetail[] = JSON.parse(body.slice(body.indexOf("["), body.indexOf("]") + 1));

	return json.map(({ isSuffix, recruiting, name, clan, title }) => ({
		isSuffix,
		recruiting: recruiting ?? null,
		name,
		clan: clan ?? null,
		title: title === "" ? null : title,
	}));
}

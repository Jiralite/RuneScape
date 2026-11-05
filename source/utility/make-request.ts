import { VERSION } from "./constants.js";

/**
 * Identifies the library in requests, as asked for by the API's best practices.
 *
 * @see {@link https://developer.runescape.com/platform/best-practices.html}
 * @internal
 */
const USER_AGENT = `runescape/${VERSION} (https://github.com/Jiralite/RuneScape)` as const;

export function makeRequest(url: string, abortSignal: AbortSignal | undefined) {
	const options: RequestInit = { headers: { "User-Agent": USER_AGENT } };

	if (abortSignal) {
		options.signal = abortSignal;
	}

	return fetch(url, options);
}

/**
 * Checks whether a response contains JSON.
 *
 * @param response - The response to check
 * @internal
 */
export function isJSONResponse(response: Response): boolean {
	return response.headers.get("content-type")?.includes("application/json") ?? false;
}

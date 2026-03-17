import { DAILYSCAPE_REMOVAL_TIMESTAMP } from "./utility/constants.js";

/**
 * Returns if a Guthixian Cache will be a full reward.
 *
 * @remarks The hour will be checked.
 * @param timestamp - A Unix timestamp.
 * @returns Whether the occurrence will be a full reward.
 * @see {@link https://runescape.wiki/w/Guthixian_Cache}
 */
export function guthixianCache(timestamp: number): boolean {
	if (timestamp >= DAILYSCAPE_REMOVAL_TIMESTAMP) {
		throw new RangeError(
			"Guthixian Cache boosts every 3 hours have been removed on 16th March 2026 13:15.",
		);
	}

	return new Date(timestamp).getUTCHours() % 3 === 0;
}

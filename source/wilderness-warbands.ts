import { DAILYSCAPE_REMOVAL_TIMESTAMP } from "./utility/constants.js";

/**
 * Returns if a Wilderness Warbands camp is set up.
 *
 * @remarks The hour will be checked.
 * @param timestamp - A Unix timestamp.
 * @returns Whether a Wilderness Warbands camp is set up.
 * @see {@link https://runescape.wiki/w/Wilderness_Warbands}
 */
export function wildernessWarbands(timestamp: number): boolean {
	if (timestamp >= DAILYSCAPE_REMOVAL_TIMESTAMP) {
		throw new RangeError("Wilderness Warbands was disabled on 16th March 2026 13:15.");
	}

	const date = new Date(timestamp);
	const start = new Date(date);
	start.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
	start.setUTCHours(2, 0, 0, 0); // First occurrence.
	return Math.floor((date.getTime() - start.getTime()) / 3_600_000) % 7 === 0;
}

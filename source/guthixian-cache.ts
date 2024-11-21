/**
 * Returns if a Guthixian Cache will be a full reward.
 *
 * @remarks The hour will be checked.
 * @param timestamp - A Unix timestamp.
 * @returns Whether the occurrence will be a full reward.
 * @see {@link https://runescape.wiki/w/Guthixian_Cache}
 */
export function guthixianCache(timestamp: number): boolean {
	return new Date(timestamp).getUTCHours() % 3 === 0;
}

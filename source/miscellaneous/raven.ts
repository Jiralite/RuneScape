const INITIAL_TIMESTAMP = Date.UTC(2_014, 9, 4);

/**
 * Returns whether a raven has spawned in Prifddinas.
 *
 * @param timestamp - A Unix timestamp.
 * @see {@link https://runescape.wiki/w/Raven_(Prifddinas)}
 */
export function raven(timestamp: number): boolean {
	return Math.floor((timestamp - INITIAL_TIMESTAMP) / 86_400_000) % 13 === 0;
}

/**
 * The version of the library.
 *
 * @remarks This must match the version in `package.json` and `jsr.json`. A test enforces this.
 * @internal
 */
export const VERSION = "1.0.0" as const;

/**
 * The timestamp at which DailyScape was removed.
 *
 * @see {@link https://secure.runescape.com/m=news/patch-notes-dailyscape-overhaul}
 * @internal
 */
export const DAILYSCAPE_REMOVAL_TIMESTAMP = Date.UTC(2_026, 2, 16, 13, 15);

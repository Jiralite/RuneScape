import { adventurersLogRequest } from "../utility/adventurers-log-request.js";

interface RawPlayerEvent {
	type: PlayerEventType;
	date: string;
	text: string;
	details: string;
}

interface RawPlayerEvents {
	name: string;
	events: readonly RawPlayerEvent[];
}

/**
 * Represents the type of an event.
 *
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/player-events.html#event-types}
 */
export enum PlayerEventType {
	/**
	 * When reaching an XP value in a skill divisible by 2,000,000.
	 */
	XPMilestone = "rs_plog_xp_milestone",
	/**
	 * After levelling up a skill.
	 */
	LevelUpCount = "rs_plog_levelup_count",
	/**
	 * When a player's lowest skill has been levelled up.
	 */
	LevelUpAllMilestone = "rs_plog_levelup_all_milestone",
	/**
	 * When total level crosses a milestone (50, 75, all multiples of 100, the F2P max, the P2P max).
	 */
	LevelUpTotalMilestone = "rs_plog_levelup_total_milestone",
	/**
	 * After receiving specific rare drops.
	 */
	ItemDrop = "rs_plog_item_drop",
	/**
	 * After killing a particular NPC one or more times.
	 */
	NPCKillCount = "rs_plog_npc_kill_count",
	/**
	 * After killing specific bosses one or more times.
	 */
	NPCDefeat = "rs_plog_npc_defeat",
	/**
	 * After obtaining specific items from loot chests or similar.
	 */
	ItemFound = "rs_plog_item_found",
	/**
	 * After obtaining specific items from loot chests or similar.
	 */
	ItemFoundNowhere = "rs_plog_item_found_nowhere",
	/**
	 * When a quest has been completed.
	 */
	Quest = "rs_plog_quest",
	/**
	 * When reaching an amount of quest points divisible by 10.
	 */
	QPMilestone = "rs_plog_qp_milestone",
	/**
	 * When reaching a champion's scroll, or defeating a champion.
	 */
	ChampionsChallenge = "rs_plog_champions_challenge",
	/**
	 * When receiving a court summons, or winning a case.
	 */
	CourtCase = "rs_plog_courtcase",
	/**
	 * After receiving specific items from a reward casket.
	 */
	FinishedTrail = "rs_plog_finished_trail",
	/**
	 * When reaching a new deepest floor record.
	 */
	DungeonsDeepestLevel = "rs_plog_dungeons_deepest_level",
	/**
	 * When a Dungeoneering session is complete.
	 */
	DungeonsBossKills = "rs_plog_dungeons_boss_kills",
	/**
	 * When a Dungeoneering book is found.
	 */
	DungeonsFoundBook = "rs_plog_dungeons_found_book",
	/**
	 * When reaching an amount of unlocked music tracks divisible by 50.
	 */
	MusicMilestone = "rs_plog_music_milestone",
	/**
	 * Anything that doesn't fit into the above categories.
	 */
	SpecialEvent = "rs_plog_special_event",
	/**
	 * After levelling up a skill.
	 *
	 * @remarks
	 * The documentation deprecated this in favour of {@link PlayerEventType.LevelUpCount}, but it may
	 * still show up for players that haven't played in a long time.
	 */
	LevelUp = "rs_plog_levelup",
	/**
	 * After killing certain NPCs.
	 *
	 * @remarks
	 * The documentation deprecated this in favour of {@link PlayerEventType.NPCKillCount}, but it may
	 * still show up for players that haven't played in a long time.
	 */
	NPCKill = "rs_plog_npc_kill",
	/**
	 * After killing another player.
	 *
	 * @remarks
	 * The documentation deprecated this, but it may still show up for players that haven't played in
	 * a long time.
	 */
	PvPKill = "rs_plog_pvp_kill",
	/**
	 * When completing a holiday event in 2009, 2010 or 2013.
	 *
	 * @remarks
	 * The documentation deprecated this, but it may still show up for players that haven't played in
	 * a long time.
	 */
	Events = "rs_plog_events",
	/**
	 * After receiving certain items from Treasure Hunter.
	 *
	 * @remarks
	 * The documentation deprecated this, but it may still show up for players that haven't played in
	 * a long time.
	 */
	WOFDrop = "rs_plog_wof_drop",
	/**
	 * After buying certain items.
	 *
	 * @remarks
	 * The documentation deprecated this, but it may still show up for players that haven't played in
	 * a long time.
	 */
	DungeonsSpendToken = "rs_plog_dungeons_spend_token",
}

/**
 * Represents an event recorded in a player's Adventurer's Log.
 *
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/player-events.html#event-object}
 */
export interface PlayerEvent {
	/**
	 * Internal name for this type of event - see {@link PlayerEventType}.
	 */
	type: PlayerEventType;
	/**
	 * Date/time for when this event occurred.
	 */
	date: Date;
	/**
	 * Human-readable title for this event.
	 *
	 * @example "I killed 2 tormented demons."
	 */
	text: string;
	/**
	 * Human-readable description for this event.
	 *
	 * @example "I killed 2 tormented demons, fewer tormented souls in the world must be a good thing."
	 */
	details: string;
}

/**
 * Represents a player's recent events.
 *
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/player-events.html#top-level-response}
 */
export interface PlayerEvents {
	/**
	 * Canonical display name for this player.
	 */
	name: string;
	/**
	 * Recent events, sorted from newest to oldest.
	 */
	events: readonly PlayerEvent[];
}

/**
 * Represents the options to provide for fetching a player's events.
 */
export interface PlayerEventsOptions {
	/**
	 * The player's name.
	 */
	name: string;
	/**
	 * The abort signal for the fetch.
	 */
	abortSignal?: AbortSignal | undefined;
}

/**
 * Returns the 20 most recent events of a player.
 *
 * @remarks
 * This only works for players with an active membership. New events may take up to 10 minutes to
 * appear.
 * @param options - The options to provide
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/player-events.html}
 */
export async function playerEvents({
	name,
	abortSignal,
}: PlayerEventsOptions): Promise<PlayerEvents> {
	const body = await adventurersLogRequest<RawPlayerEvents>(
		"playerEvents",
		name,
		"Error fetching player events.",
		abortSignal,
	);

	return {
		name: body.name,
		events: body.events.map(({ type, date, text, details }) => ({
			type,
			date: new Date(date),
			text,
			details,
		})),
	};
}

/**
 * Standardises {@link PlayerEvent.details} or {@link PlayerEvent.text} to ensure consistent formatting.
 *
 * @remarks
 * - Removes extra spaces between words
 * - Lowercases articles (A, An) that appear after double spaces
 * - Formats experience numbers with commas and lowercase (e.g. "124000000XP" to "124,000,000 xp")
 * - Ensures the string ends with a full stop if it doesn't already end with punctuation (., !, ?)
 * @param log - The {@link PlayerEvent.details} or {@link PlayerEvent.text} to standardise
 */
export function standardisePlayerEventLog(log: string): string {
	// Lowercase articles that appear after double spaces before normalising.
	let result = log.replaceAll(/\s{2,}(A|An)\s/g, (_match, article: string) => {
		return ` ${article.toLowerCase()} `;
	});

	// Normalise remaining spaces.
	result = result.replaceAll(/\s+/g, " ");

	// Format experience numbers with commas and lowercase (e.g. "124000000XP" to "124,000,000 xp").
	result = result.replaceAll(/(\d+)XP/gi, (_match, number) => {
		const formattedNumber = Number(number).toLocaleString("en-GB");
		return `${formattedNumber} xp`;
	});

	// Format experience numbers before "experience points" (e.g. "100000000 experience points" to "100,000,000 experience points").
	result = result.replaceAll(/(\d+)\s+experience points/gi, (_match, number) => {
		const formattedNumber = Number(number).toLocaleString("en-GB");
		return `${formattedNumber} experience points`;
	});

	// Check if the string already ends with sentence-ending punctuation.
	const endsWithPunctuation = /[.!?]$/.test(result);

	if (endsWithPunctuation) {
		return result;
	}

	return `${result}.`;
}

import { RuneScapeAPIError } from "../utility/error.js";
import { isJSONResponse, makeRequest } from "../utility/make-request.js";
import { HiScoreInstance, OldSchoolHiScoreInstance } from "./instances.js";

interface RawDeath extends Omit<HiScoreDeath, "timeStamp" | "worldId"> {
	timeStamp: number;
	worldID: number;
}

interface RawSkill {
	id: number;
	rank: number;
	level: number;
	xp: number;
	death?: RawDeath;
}

interface RawHiScore {
	name: string;
	skills: readonly RawSkill[];
	activities: readonly HiScoreActivity[];
}

/**
 * Represents the skills in RuneScape.
 */
export enum Skill {
	Agility = "Agility",
	Archaeology = "Archaeology",
	Attack = "Attack",
	Construction = "Construction",
	Cooking = "Cooking",
	Crafting = "Crafting",
	Defence = "Defence",
	Divination = "Divination",
	Dungeoneering = "Dungeoneering",
	Farming = "Farming",
	Firemaking = "Firemaking",
	Fishing = "Fishing",
	Fletching = "Fletching",
	Herblore = "Herblore",
	Hitpoints = "Hitpoints",
	Hunter = "Hunter",
	Invention = "Invention",
	Magic = "Magic",
	Mining = "Mining",
	Necromancy = "Necromancy",
	Prayer = "Prayer",
	Ranged = "Ranged",
	Runecraft = "Runecraft",
	Slayer = "Slayer",
	Smithing = "Smithing",
	Strength = "Strength",
	Summoning = "Summoning",
	Thieving = "Thieving",
	Woodcutting = "Woodcutting",
}

/**
 * Represents the data of a HiScore skill.
 *
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html#skill-object}
 */
export interface HiScoreSkill<T extends Skill | OldSchoolSkill | "Overall"> {
	/**
	 * Index of this skill (0 for "Overall", 1 and up for actual skills).
	 *
	 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html#skill-object}
	 */
	id: number;
	/**
	 * Name of this skill.
	 */
	name: T;
	/**
	 * Position of this player (starting at 1) in this table, or `-1` if they are not ranked.
	 *
	 * @remarks
	 * Hiscore will automatically assign a rank to the top 2,000,000 players in each table. If multiple
	 * players have the same value, the one that got there first will be ranked higher. Players below
	 * that point will still have the value stored, but no rank will be assigned.
	 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index.html#tables}
	 */
	rank: number;
	/**
	 * Level the player has in this skill (or total level, for "Overall").
	 *
	 * @remarks
	 * In some older Hiscore records, `level` and `xp` will be set to `-1`, which signifies that no data
	 * is available - see {@link https://developer.runescape.com/platform/modules/hiscores/index.html#partial-data} for an explanation.
	 */
	level: number;
	/**
	 * XP the player has in this skill (or total XP, for "Overall").
	 *
	 * @remarks
	 * In some older Hiscore records, `level` and `xp` will be set to `-1`, which signifies that no data
	 * is available - see {@link https://developer.runescape.com/platform/modules/hiscores/index.html#partial-data} for an explanation.
	 */
	xp: number;
}

/**
 * Represents the data of the Overall HiScore table.
 *
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html#skill-object}
 */
export interface HiScoreOverall extends HiScoreSkill<"Overall"> {
	/**
	 * Optional, Hardcore Ironman instances only - If this player has lost their HCIM status, describes
	 * the circumstances.
	 *
	 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html#skill-object}
	 */
	death?: HiScoreDeath | undefined;
}

/**
 * Represents the data of a HiScore activity.
 *
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html#activity-object}
 */
export interface HiScoreActivity {
	/**
	 * Index of this activity, starting at 0.
	 *
	 * @remarks
	 * Despite the name, `id` is not guaranteed to stay the same over time. New activities are often
	 * added in the middle of the list which will increase the `id` for existing ones. You should use
	 * `name` to distinguish activities over time.
	 */
	id: number;
	/**
	 * Name of this activity.
	 */
	name: string;
	/**
	 * Position of this player (starting at 1) in this table, or `-1` if they are not ranked.
	 *
	 * @remarks
	 * Hiscore will automatically assign a rank to the top 2,000,000 players in each table. If multiple
	 * players have the same value, the one that got there first will be ranked higher. Players below
	 * that point will still have the value stored, but no rank will be assigned.
	 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index.html#tables}
	 */
	rank: number;
	/**
	 * Value - exact meaning depends on the activity (points, score, kill count, etc.).
	 *
	 * @remarks
	 * In some older Hiscore records, `score` will be set to `-1`, which signifies that no data is
	 * available - see {@link https://developer.runescape.com/platform/modules/hiscores/index.html#partial-data} for an explanation.
	 */
	score: number;
}

/**
 * Represents the circumstances of a Hardcore Ironman player's death.
 *
 * @remarks
 * This object is only present in the Skill object with ID 0 and name "Overall" on the Hardcore
 * Ironman instances, and only for players which have been recorded as dead.
 *
 * Old School deaths do not include any data for the killer, reason or description fields.
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html#death-record-object}
 */
export interface HiScoreDeath {
	/**
	 * Timestamp of the death.
	 */
	timeStamp: Date;
	/**
	 * World ID where the player died.
	 */
	worldId: number;
	/**
	 * Coordinates where the player died (bit-packed: `(level << 28) | (x << 14) | z`), or `-1` if data
	 * unavailable.
	 */
	location: number;
	/**
	 * ID of the NPC that killed the player, or `-1` if unavailable.
	 */
	npcKiller: number;
	/**
	 * Always `-1`.
	 */
	playerKiller: number;
	/**
	 * ID of the reason for this player's death, or `-1` if unavailable.
	 */
	deathReason: number;
	/**
	 * Language code of the text descriptions, usually `EN`.
	 */
	language: string;
	/**
	 * Sentence fragment describing where in the game world the player died, or an empty string if
	 * unavailable.
	 */
	locationDescription: string;
	/**
	 * Sentence fragment describing how the player died, or an empty string if unavailable.
	 */
	deathDescription: string;
}

/**
 * Represents a player's HiScore data.
 *
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html#top-level-response}
 */
export interface HiScore {
	/**
	 * Display name for this player, as provided in the URL - may not match the actual case of the
	 * name.
	 *
	 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html#top-level-response}
	 */
	name: string;
	/**
	 * Overall skill data.
	 */
	overall: HiScoreOverall;
	/**
	 * Attack skill data.
	 */
	attack: HiScoreSkill<Skill.Attack>;
	/**
	 * Defence skill data.
	 */
	defence: HiScoreSkill<Skill.Defence>;
	/**
	 * Strength skill data.
	 */
	strength: HiScoreSkill<Skill.Strength>;
	/**
	 * Hitpoints skill data.
	 */
	hitpoints: HiScoreSkill<Skill.Hitpoints>;
	/**
	 * Ranged skill data.
	 */
	ranged: HiScoreSkill<Skill.Ranged>;
	/**
	 * Prayer skill data.
	 */
	prayer: HiScoreSkill<Skill.Prayer>;
	/**
	 * Magic skill data.
	 */
	magic: HiScoreSkill<Skill.Magic>;
	/**
	 * Cooking skill data.
	 */
	cooking: HiScoreSkill<Skill.Cooking>;
	/**
	 * Woodcutting skill data.
	 */
	woodcutting: HiScoreSkill<Skill.Woodcutting>;
	/**
	 * Fletching skill data.
	 */
	fletching: HiScoreSkill<Skill.Fletching>;
	/**
	 * Fishing skill data.
	 */
	fishing: HiScoreSkill<Skill.Fishing>;
	/**
	 * Firemaking skill data.
	 */
	firemaking: HiScoreSkill<Skill.Firemaking>;
	/**
	 * Crafting skill data.
	 */
	crafting: HiScoreSkill<Skill.Crafting>;
	/**
	 * Smithing skill data.
	 */
	smithing: HiScoreSkill<Skill.Smithing>;
	/**
	 * Mining skill data.
	 */
	mining: HiScoreSkill<Skill.Mining>;
	/**
	 * Herblore skill data.
	 */
	herblore: HiScoreSkill<Skill.Herblore>;
	/**
	 * Agility skill data.
	 */
	agility: HiScoreSkill<Skill.Agility>;
	/**
	 * Thieving skill data.
	 */
	thieving: HiScoreSkill<Skill.Thieving>;
	/**
	 * Slayer skill data.
	 */
	slayer: HiScoreSkill<Skill.Slayer>;
	/**
	 * Farming skill data.
	 */
	farming: HiScoreSkill<Skill.Farming>;
	/**
	 * Runecraft skill data.
	 */
	runecraft: HiScoreSkill<Skill.Runecraft>;
	/**
	 * Hunter skill data.
	 */
	hunter: HiScoreSkill<Skill.Hunter>;
	/**
	 * Construction skill data.
	 */
	construction: HiScoreSkill<Skill.Construction>;
	/**
	 * Summoning skill data.
	 */
	summoning: HiScoreSkill<Skill.Summoning>;
	/**
	 * Dungeoneering skill data.
	 */
	dungeoneering: HiScoreSkill<Skill.Dungeoneering>;
	/**
	 * Divination skill data.
	 */
	divination: HiScoreSkill<Skill.Divination>;
	/**
	 * Invention skill data.
	 */
	invention: HiScoreSkill<Skill.Invention>;
	/**
	 * Archaeology skill data.
	 */
	archaeology: HiScoreSkill<Skill.Archaeology>;
	/**
	 * Necromancy skill data.
	 */
	necromancy: HiScoreSkill<Skill.Necromancy>;
	/**
	 * Array of activity objects, representing this player's stats in activities.
	 *
	 * @remarks
	 * Activities for special game modes (e.g. Grid Points, League Points) will always be included in
	 * the list, even on instances where they're not relevant.
	 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html#top-level-response}
	 */
	activities: readonly HiScoreActivity[];
}

/**
 * Represents the options to provide for fetching a player's HiScore data.
 */
export interface HiScoreOptions {
	/**
	 * The player's name.
	 */
	name: string;
	/**
	 * The instance to read from.
	 *
	 * @defaultValue {@link HiScoreInstance.Standard}
	 */
	instance?: HiScoreInstance | undefined;
	/**
	 * The abort signal for the fetch.
	 */
	abortSignal?: AbortSignal | undefined;
}

/**
 * Represents the skills in Old School RuneScape.
 */
export enum OldSchoolSkill {
	Agility = "Agility",
	Attack = "Attack",
	Construction = "Construction",
	Cooking = "Cooking",
	Crafting = "Crafting",
	Defence = "Defence",
	Farming = "Farming",
	Firemaking = "Firemaking",
	Fishing = "Fishing",
	Fletching = "Fletching",
	Herblore = "Herblore",
	Hitpoints = "Hitpoints",
	Hunter = "Hunter",
	Magic = "Magic",
	Mining = "Mining",
	Prayer = "Prayer",
	Ranged = "Ranged",
	Runecraft = "Runecraft",
	Sailing = "Sailing",
	Slayer = "Slayer",
	Smithing = "Smithing",
	Strength = "Strength",
	Thieving = "Thieving",
	Woodcutting = "Woodcutting",
}

/**
 * Represents a player's Old School RuneScape HiScore data.
 *
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html#top-level-response}
 */
export interface OldSchoolHiScore {
	/**
	 * Display name for this player, as provided in the URL - may not match the actual case of the
	 * name.
	 *
	 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html#top-level-response}
	 */
	name: string;
	/**
	 * Overall skill data.
	 */
	overall: HiScoreOverall;
	/**
	 * Attack skill data.
	 */
	attack: HiScoreSkill<OldSchoolSkill.Attack>;
	/**
	 * Defence skill data.
	 */
	defence: HiScoreSkill<OldSchoolSkill.Defence>;
	/**
	 * Strength skill data.
	 */
	strength: HiScoreSkill<OldSchoolSkill.Strength>;
	/**
	 * Hitpoints skill data.
	 */
	hitpoints: HiScoreSkill<OldSchoolSkill.Hitpoints>;
	/**
	 * Ranged skill data.
	 */
	ranged: HiScoreSkill<OldSchoolSkill.Ranged>;
	/**
	 * Prayer skill data.
	 */
	prayer: HiScoreSkill<OldSchoolSkill.Prayer>;
	/**
	 * Magic skill data.
	 */
	magic: HiScoreSkill<OldSchoolSkill.Magic>;
	/**
	 * Cooking skill data.
	 */
	cooking: HiScoreSkill<OldSchoolSkill.Cooking>;
	/**
	 * Woodcutting skill data.
	 */
	woodcutting: HiScoreSkill<OldSchoolSkill.Woodcutting>;
	/**
	 * Fletching skill data.
	 */
	fletching: HiScoreSkill<OldSchoolSkill.Fletching>;
	/**
	 * Fishing skill data.
	 */
	fishing: HiScoreSkill<OldSchoolSkill.Fishing>;
	/**
	 * Firemaking skill data.
	 */
	firemaking: HiScoreSkill<OldSchoolSkill.Firemaking>;
	/**
	 * Crafting skill data.
	 */
	crafting: HiScoreSkill<OldSchoolSkill.Crafting>;
	/**
	 * Smithing skill data.
	 */
	smithing: HiScoreSkill<OldSchoolSkill.Smithing>;
	/**
	 * Mining skill data.
	 */
	mining: HiScoreSkill<OldSchoolSkill.Mining>;
	/**
	 * Herblore skill data.
	 */
	herblore: HiScoreSkill<OldSchoolSkill.Herblore>;
	/**
	 * Agility skill data.
	 */
	agility: HiScoreSkill<OldSchoolSkill.Agility>;
	/**
	 * Thieving skill data.
	 */
	thieving: HiScoreSkill<OldSchoolSkill.Thieving>;
	/**
	 * Slayer skill data.
	 */
	slayer: HiScoreSkill<OldSchoolSkill.Slayer>;
	/**
	 * Farming skill data.
	 */
	farming: HiScoreSkill<OldSchoolSkill.Farming>;
	/**
	 * Runecraft skill data.
	 */
	runecraft: HiScoreSkill<OldSchoolSkill.Runecraft>;
	/**
	 * Hunter skill data.
	 */
	hunter: HiScoreSkill<OldSchoolSkill.Hunter>;
	/**
	 * Construction skill data.
	 */
	construction: HiScoreSkill<OldSchoolSkill.Construction>;
	/**
	 * Sailing skill data.
	 */
	sailing: HiScoreSkill<OldSchoolSkill.Sailing>;
	/**
	 * Array of activity objects, representing this player's stats in activities.
	 *
	 * @remarks
	 * Activities for special game modes (e.g. Grid Points, League Points) will always be included in
	 * the list, even on instances where they're not relevant.
	 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html#top-level-response}
	 */
	activities: readonly HiScoreActivity[];
}

/**
 * Represents the options to provide for fetching a player's Old School RuneScape HiScore data.
 */
export interface OldSchoolHiScoreOptions {
	/**
	 * The player's name.
	 */
	name: string;
	/**
	 * The instance to read from.
	 *
	 * @defaultValue {@link OldSchoolHiScoreInstance.Standard}
	 */
	instance?: OldSchoolHiScoreInstance | undefined;
	/**
	 * The abort signal for the fetch.
	 */
	abortSignal?: AbortSignal | undefined;
}

/**
 * Fetches a player's data from an instance.
 *
 * @param instance - The instance to read from
 * @param name - The player's name
 * @param abortSignal - The abort signal for the fetch
 * @returns The player's name, activities and overall data, and a function to read a skill by its id.
 * @internal
 */
async function fetchIndexLite(
	instance: HiScoreInstance | OldSchoolHiScoreInstance,
	name: string,
	abortSignal: AbortSignal | undefined,
) {
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set("player", name);
	const url =
		`https://secure.runescape.com/m=${instance}/index_lite.json?${urlSearchParams.toString()}` as const;
	const response = await makeRequest(url, abortSignal);

	// Missing players and instances that are not running respond with HTML.
	if (!(response.ok && isJSONResponse(response))) {
		throw new RuneScapeAPIError("Error fetching HiScore data.", response.status, url);
	}

	const { name: displayName, skills, activities } = (await response.json()) as RawHiScore;
	const skillsById = new Map(skills.map((skill) => [skill.id, skill]));

	function skill<T extends Skill | OldSchoolSkill | "Overall">(
		id: number,
		skillName: T,
	): HiScoreSkill<T> {
		const { rank, level, xp } = skillsById.get(id)!;
		return { id, name: skillName, rank, level, xp };
	}

	const overall: HiScoreOverall = skill(0, "Overall");
	const { death } = skillsById.get(0)!;

	if (death) {
		const { timeStamp, worldID, ...rest } = death;
		overall.death = { timeStamp: new Date(timeStamp), worldId: worldID, ...rest };
	}

	return { name: displayName, overall, activities, skill };
}

/**
 * Returns the player's HiScore data.
 *
 * @remarks
 * Hiscores will update within a couple of seconds when any of these events occurs:
 *
 * - Player logs out
 * - Player hops to a different world
 * - Player loses eligibility for a specific Hiscore instance (e.g. Hardcore Ironman losing their last
 * life, or an Old School skill pure levelling up a combat skill)
 * @param options - The options to provide
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html}
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index.html#update-delays}
 */
export async function hiScore({
	name,
	instance = HiScoreInstance.Standard,
	abortSignal,
}: HiScoreOptions): Promise<HiScore> {
	const {
		name: displayName,
		overall,
		activities,
		skill,
	} = await fetchIndexLite(instance, name, abortSignal);

	return {
		name: displayName,
		overall,
		attack: skill(1, Skill.Attack),
		defence: skill(2, Skill.Defence),
		strength: skill(3, Skill.Strength),
		hitpoints: skill(4, Skill.Hitpoints),
		ranged: skill(5, Skill.Ranged),
		prayer: skill(6, Skill.Prayer),
		magic: skill(7, Skill.Magic),
		cooking: skill(8, Skill.Cooking),
		woodcutting: skill(9, Skill.Woodcutting),
		fletching: skill(10, Skill.Fletching),
		fishing: skill(11, Skill.Fishing),
		firemaking: skill(12, Skill.Firemaking),
		crafting: skill(13, Skill.Crafting),
		smithing: skill(14, Skill.Smithing),
		mining: skill(15, Skill.Mining),
		herblore: skill(16, Skill.Herblore),
		agility: skill(17, Skill.Agility),
		thieving: skill(18, Skill.Thieving),
		slayer: skill(19, Skill.Slayer),
		farming: skill(20, Skill.Farming),
		runecraft: skill(21, Skill.Runecraft),
		hunter: skill(22, Skill.Hunter),
		construction: skill(23, Skill.Construction),
		summoning: skill(24, Skill.Summoning),
		dungeoneering: skill(25, Skill.Dungeoneering),
		divination: skill(26, Skill.Divination),
		invention: skill(27, Skill.Invention),
		archaeology: skill(28, Skill.Archaeology),
		necromancy: skill(29, Skill.Necromancy),
		activities,
	};
}

/**
 * Returns the player's Old School RuneScape HiScore data.
 *
 * @remarks
 * Hiscores will update within a couple of seconds when any of these events occurs:
 *
 * - Player logs out
 * - Player hops to a different world
 * - Player loses eligibility for a specific Hiscore instance (e.g. Hardcore Ironman losing their last
 * life, or an Old School skill pure levelling up a combat skill)
 * @param options - The options to provide
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index-lite.html}
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/index.html#update-delays}
 */
export async function oldSchoolHiScore({
	name,
	instance = OldSchoolHiScoreInstance.Standard,
	abortSignal,
}: OldSchoolHiScoreOptions): Promise<OldSchoolHiScore> {
	const {
		name: displayName,
		overall,
		activities,
		skill,
	} = await fetchIndexLite(instance, name, abortSignal);

	return {
		name: displayName,
		overall,
		attack: skill(1, OldSchoolSkill.Attack),
		defence: skill(2, OldSchoolSkill.Defence),
		strength: skill(3, OldSchoolSkill.Strength),
		hitpoints: skill(4, OldSchoolSkill.Hitpoints),
		ranged: skill(5, OldSchoolSkill.Ranged),
		prayer: skill(6, OldSchoolSkill.Prayer),
		magic: skill(7, OldSchoolSkill.Magic),
		cooking: skill(8, OldSchoolSkill.Cooking),
		woodcutting: skill(9, OldSchoolSkill.Woodcutting),
		fletching: skill(10, OldSchoolSkill.Fletching),
		fishing: skill(11, OldSchoolSkill.Fishing),
		firemaking: skill(12, OldSchoolSkill.Firemaking),
		crafting: skill(13, OldSchoolSkill.Crafting),
		smithing: skill(14, OldSchoolSkill.Smithing),
		mining: skill(15, OldSchoolSkill.Mining),
		herblore: skill(16, OldSchoolSkill.Herblore),
		agility: skill(17, OldSchoolSkill.Agility),
		thieving: skill(18, OldSchoolSkill.Thieving),
		slayer: skill(19, OldSchoolSkill.Slayer),
		farming: skill(20, OldSchoolSkill.Farming),
		runecraft: skill(21, OldSchoolSkill.Runecraft),
		hunter: skill(22, OldSchoolSkill.Hunter),
		construction: skill(23, OldSchoolSkill.Construction),
		sailing: skill(24, OldSchoolSkill.Sailing),
		activities,
	};
}

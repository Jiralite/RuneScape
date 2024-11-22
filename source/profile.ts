import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { ErrorCode, RuneScapeAPIError, RuneScapeError } from "./utility/error.js";
import { makeRequest } from "./utility/make-request.js";

interface RawProfile {
	magic: number;
	questsstarted: number;
	totalskill: number;
	questscomplete: number;
	questsnotstarted: number;
	totalxp: number;
	ranged: number;
	activities: RawProfileActivity[];
	skillvalues: ProfileSkills[];
	name: string;
	rank: string | null;
	melee: number;
	combatlevel: number;
	loggedIn: `${boolean}`;
}

/**
 * Represents the type of error that may be encountered when fetching a player's RuneMetrics profile.
 *
 * @internal
 */
enum ProfileErrorType {
	NoProfile = "NO_PROFILE",
	NotAMember = "NOT_A_MEMBER",
	ProfilePrivate = "PROFILE_PRIVATE",
}

/**
 * Represents an error returned when fetching a player's RuneMetrics profile.
 *
 * @internal
 */
interface ProfileError {
	error: ProfileErrorType;
	loggedIn: "false";
}

/**
 * Represents the returned RuneMetrics profile activity.
 *
 * @internal
 */
interface RawProfileActivity {
	date: string;
	details: string;
	text: string;
}

/**
 * Represents the RuneMetrics profile activity.
 */
export interface ProfileActivity {
	/**
	 * The timestamp of the activity.
	 */
	timestamp: number;
	/**
	 * The details of the activity.
	 *
	 * @example "I killed 2 tormented demons, fewer tormented souls in the world must be a good thing."
	 */
	details: string;
	/**
	 * The shortened variant of the {@link ProfileActivity.details}.
	 *
	 * @example "I killed 2 tormented demons."
	 */
	text: string;
}

/**
 * Represents the enumeration of skills as returned from the API.
 */
export enum SkillId {
	Attack = 0,
	Defence = 1,
	Strength = 2,
	Constitution = 3,
	Ranged = 4,
	Prayer = 5,
	Magic = 6,
	Cooking = 7,
	Woodcutting = 8,
	Fletching = 9,
	Fishing = 10,
	Firemaking = 11,
	Crafting = 12,
	Smithing = 13,
	Mining = 14,
	Herblore = 15,
	Agility = 16,
	Thieving = 17,
	Slayer = 18,
	Farming = 19,
	Runecrafting = 20,
	Hunter = 21,
	Construction = 22,
	Summoning = 23,
	Dungeoneering = 24,
	Divination = 25,
	Invention = 26,
	Archaeology = 27,
}

/**
 * Represents data about the player's stats as returned from the RuneMetrics profile.
 */
export interface ProfileSkills {
	/**
	 * The level of the skill.
	 */
	level: number;
	/**
	 * The experience of the skill.
	 *
	 * @remarks The experience is accurate to one decimal place.
	 * @example 200000000.0
	 */
	xp: number;
	/**
	 * The rank this skill is in the HiScores.
	 */
	rank: number | undefined;
	/**
	 * The id of this skill.
	 *
	 * @remarks This is the specific number belonging to a skill. The {@link SkillId} enumeration may help here.
	 */
	id: SkillId;
}

/**
 * Represents data about player's RuneMetrics Profile.
 */
export interface Profile {
	/**
	 * It's not known what this represents.
	 *
	 * @experimental
	 */
	magic: RawProfile["magic"];
	/**
	 * The amount of quests the player has started.
	 */
	questsStarted: RawProfile["questsstarted"];
	/**
	 * The total level of the player.
	 */
	totalSkill: RawProfile["totalskill"];
	/**
	 * The amount of quests the player has completed.
	 */
	questsComplete: RawProfile["questscomplete"];
	/**
	 * The amount of quests the player has not started.
	 */
	questsNotStarted: RawProfile["questsnotstarted"];
	/**
	 * The total experience of the player.
	 */
	totalXp: RawProfile["totalxp"];
	/**
	 * It's not known what this represents.
	 *
	 * @experimental
	 */
	ranged: RawProfile["ranged"];
	/**
	 * The activities of the player.
	 *
	 * @remarks This is the event log of the player; formerly known as the Adventurer's Log.
	 */
	activities: ProfileActivity[];
	/**
	 * An array of skill values of the player.
	 *
	 * @remarks This is an array of the player's skills containing various information.
	 */
	skillValues: RawProfile["skillvalues"];
	/**
	 * The name of the player.
	 *
	 * @remarks This returns the corrects the capitalisation of the player's name.
	 */
	name: RawProfile["name"];
	/**
	 * The rank of the player.
	 *
	 * @remarks When not `null`, this is separated by commas.
	 * @example "8,181"
	 */
	rank: RawProfile["rank"];
	/**
	 * It's not known what this represents.
	 *
	 * @experimental
	 */
	melee: RawProfile["melee"];
	/**
	 * The combat level of the player.
	 */
	combatLevel: RawProfile["combatlevel"];
	/**
	 * Whether the player is signed in to RuneMetrics.
	 *
	 * @remarks Because of how this data is retrieved, this may be assumed to always be `false`.
	 */
	loggedIn: boolean;
}

/**
 * Represents the options to provide for fetching a RuneMetrics profile.
 */
export interface ProfileOptions {
	/**
	 * The player's name.
	 */
	name: string;
	/**
	 * The maximum number of activities to return.
	 *
	 * @remarks 20 is the maximum number this limit abides by.
	 */
	activities?: number;
	/**
	 * The abort signal for the fetch.
	 */
	abortSignal?: AbortSignal | undefined;
}

dayjs.extend(utc);

/**
 * Returns the player's profile data as viewed on RuneMetrics.
 *
 * @param options - The options to provide
 * @returns The profile of the player as described by RuneMetrics.
 */
export async function profile({ name, activities, abortSignal }: ProfileOptions): Promise<Profile> {
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set("user", name);

	if (typeof activities === "number") {
		urlSearchParams.set("activities", String(activities));
	}

	const url = `https://apps.runescape.com/runemetrics/profile?${urlSearchParams}` as const;
	const response = await makeRequest(url, abortSignal);

	if (!response.ok) {
		throw new RuneScapeAPIError("Error fetching RuneMetrics profile data.", response.status, url);
	}

	const body = (await response.json()) as ProfileError | RawProfile;

	if ("error" in body) {
		let code: (typeof ErrorCode)[keyof typeof ErrorCode];

		switch (body.error) {
			case ProfileErrorType.NotAMember:
				code = ErrorCode.ProfileNotAMember;
				break;
			case ProfileErrorType.ProfilePrivate:
				code = ErrorCode.ProfilePrivate;
				break;
			case ProfileErrorType.NoProfile:
				code = ErrorCode.ProfileNone;
				break;
			default:
				code = ErrorCode.ProfileError;
		}

		throw new RuneScapeError(code, body.error, url);
	}

	const {
		magic,
		questsstarted,
		totalskill,
		questscomplete,
		questsnotstarted,
		totalxp,
		ranged,
		activities: rawActivities,
		skillvalues,
		name: rawName,
		rank,
		melee,
		combatlevel,
		loggedIn,
	} = body;

	return {
		magic,
		questsStarted: questsstarted,
		totalSkill: totalskill,
		questsComplete: questscomplete,
		questsNotStarted: questsnotstarted,
		totalXp: totalxp,
		ranged,
		activities: rawActivities.map(({ date, details, text }) => ({
			timestamp: dayjs.utc(date, "Europe/London").valueOf(),
			details,
			text,
		})),
		skillValues: skillvalues.map(({ level, xp, rank, id }) => ({
			level,
			xp: xp / 10,
			rank,
			id,
		})),
		name: rawName,
		rank,
		melee,
		combatLevel: combatlevel,
		loggedIn: loggedIn === "true",
	};
}

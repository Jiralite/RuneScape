import { afterEach, describe, expect, test, vi } from "vitest";
import {
	hiScore,
	OldSchoolSkill,
	oldSchoolHiScore,
	Skill,
} from "../../source/hiscores/index-lite.js";
import { HiScoreInstance, OldSchoolHiScoreInstance } from "../../source/hiscores/instances.js";
import { RuneScapeAPIError } from "../../source/utility/error.js";
import { stubFetch } from "../utility/stub-fetch.js";

const SKILL_NAMES = [
	"Overall",
	"Attack",
	"Defence",
	"Strength",
	"Hitpoints",
	"Ranged",
	"Prayer",
	"Magic",
	"Cooking",
	"Woodcutting",
	"Fletching",
	"Fishing",
	"Firemaking",
	"Crafting",
	"Smithing",
	"Mining",
	"Herblore",
	"Agility",
	"Thieving",
	"Slayer",
	"Farming",
	"Runecraft",
	"Hunter",
	"Construction",
	"Summoning",
	"Dungeoneering",
	"Divination",
	"Invention",
	"Archaeology",
	"Necromancy",
] as const;

const OLD_SCHOOL_SKILL_NAMES = [...SKILL_NAMES.slice(0, 24), "Sailing"] as const;
const activities = [{ id: 0, name: "Grid Points", rank: -1, score: 0 }];

const rawDeath = {
	timeStamp: 1_594_717_976_929,
	worldID: 48,
	location: 805_306_368,
	npcKiller: -1,
	playerKiller: -1,
	deathReason: -1,
	language: "EN",
	locationDescription: "Wilderness, ",
	deathDescription: "fighting in PvP combat against testacct2.",
};

function rawSkills(names: readonly string[]) {
	return names.map((name, id) => ({
		id,
		name,
		rank: 1_000 + id,
		level: 50 + id,
		xp: 10_000 + id,
	}));
}

const body = { name: "Mod Example", skills: rawSkills(SKILL_NAMES), activities };
const oldSchoolBody = {
	name: "Mod Example",
	skills: rawSkills(OLD_SCHOOL_SKILL_NAMES),
	activities,
};

function withDeath(skills: ReturnType<typeof rawSkills>) {
	return skills.map((skill) => (skill.id === 0 ? { ...skill, death: rawDeath } : skill));
}

describe("hiScore", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test("Maps skills by id, regardless of their order in the response.", async () => {
		stubFetch({ ...body, skills: body.skills.toReversed() });
		const result = await hiScore({ name: "Mod Example" });

		expect(result.overall).toStrictEqual({
			id: 0,
			name: "Overall",
			rank: 1_000,
			level: 50,
			xp: 10_000,
		});

		expect(result.hitpoints).toStrictEqual({
			id: 4,
			name: Skill.Hitpoints,
			rank: 1_004,
			level: 54,
			xp: 10_004,
		});

		expect(result.runecraft).toStrictEqual({
			id: 21,
			name: Skill.Runecraft,
			rank: 1_021,
			level: 71,
			xp: 10_021,
		});

		expect(result.necromancy).toStrictEqual({
			id: 29,
			name: Skill.Necromancy,
			rank: 1_029,
			level: 79,
			xp: 10_029,
		});
	});

	test("Returns the name and activities.", async () => {
		stubFetch(body);
		const result = await hiScore({ name: "mod example" });
		expect(result.name).toBe("Mod Example");
		expect(result.activities).toStrictEqual(activities);
	});

	test("Converts the death timestamp to a Date object and renames the world id.", async () => {
		stubFetch({ ...body, skills: withDeath(body.skills) });
		const { overall } = await hiScore({ name: "Mod Example" });

		const { timeStamp, worldID, ...rest } = rawDeath;

		expect(overall.death).toStrictEqual({
			timeStamp: new Date(timeStamp),
			worldId: worldID,
			...rest,
		});
	});

	test("Omits the death when there is none.", async () => {
		stubFetch(body);
		const { overall } = await hiScore({ name: "Mod Example" });
		expect(overall).not.toHaveProperty("death");
	});

	test("Uses the standard instance by default.", async () => {
		const fetchMock = stubFetch(body);
		await hiScore({ name: "Mod Example" });

		expect(fetchMock.mock.calls[0]![0]).toBe(
			"https://secure.runescape.com/m=hiscore/index_lite.json?player=Mod+Example",
		);
	});

	test("Uses the provided instance.", async () => {
		const fetchMock = stubFetch(body);
		await hiScore({ name: "Mod Example", instance: HiScoreInstance.HardcoreIronman });

		expect(fetchMock.mock.calls[0]![0]).toBe(
			"https://secure.runescape.com/m=hiscore_hardcore_ironman/index_lite.json?player=Mod+Example",
		);
	});

	test.each([
		["a missing player", 404],
		["an instance that is not running", 200],
	])("Throws an API error for the HTML sent by %s.", async (_description, statusCode) => {
		stubFetch("<!DOCTYPE html>", statusCode, "text/html");
		const request = hiScore({ name: "Mod Example" });
		await expect(request).rejects.toBeInstanceOf(RuneScapeAPIError);
		await expect(request).rejects.toMatchObject({ statusCode });
	});
});

describe("oldSchoolHiScore", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test("Maps skills by id, including those unique to Old School.", async () => {
		stubFetch({ ...oldSchoolBody, skills: oldSchoolBody.skills.toReversed() });
		const result = await oldSchoolHiScore({ name: "Mod Example" });

		expect(result.hitpoints).toStrictEqual({
			id: 4,
			name: OldSchoolSkill.Hitpoints,
			rank: 1_004,
			level: 54,
			xp: 10_004,
		});

		expect(result.runecraft).toStrictEqual({
			id: 21,
			name: OldSchoolSkill.Runecraft,
			rank: 1_021,
			level: 71,
			xp: 10_021,
		});

		expect(result.sailing).toStrictEqual({
			id: 24,
			name: OldSchoolSkill.Sailing,
			rank: 1_024,
			level: 74,
			xp: 10_024,
		});
	});

	test("Returns the name and activities.", async () => {
		stubFetch(oldSchoolBody);
		const result = await oldSchoolHiScore({ name: "mod example" });
		expect(result.name).toBe("Mod Example");
		expect(result.activities).toStrictEqual(activities);
	});

	test("Converts the death timestamp to a Date object.", async () => {
		stubFetch({ ...oldSchoolBody, skills: withDeath(oldSchoolBody.skills) });
		const { overall } = await oldSchoolHiScore({ name: "Mod Example" });
		expect(overall.death?.timeStamp).toStrictEqual(new Date(rawDeath.timeStamp));
	});

	test("Uses the standard Old School instance by default.", async () => {
		const fetchMock = stubFetch(oldSchoolBody);
		await oldSchoolHiScore({ name: "Mod Example" });

		expect(fetchMock.mock.calls[0]![0]).toBe(
			"https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player=Mod+Example",
		);
	});

	test("Uses the provided instance.", async () => {
		const fetchMock = stubFetch(oldSchoolBody);
		await oldSchoolHiScore({
			name: "Mod Example",
			instance: OldSchoolHiScoreInstance.HardcoreWorlds,
		});

		expect(fetchMock.mock.calls[0]![0]).toBe(
			"https://secure.runescape.com/m=hiscore_oldschool_hardcore_mains/index_lite.json?player=Mod+Example",
		);
	});

	test("Throws an API error for HTML.", async () => {
		stubFetch("<!DOCTYPE html>", 404, "text/html");
		const request = oldSchoolHiScore({ name: "Mod Example" });
		await expect(request).rejects.toBeInstanceOf(RuneScapeAPIError);
		await expect(request).rejects.toMatchObject({ statusCode: 404 });
	});
});

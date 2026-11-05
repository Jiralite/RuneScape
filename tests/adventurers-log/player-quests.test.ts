import { afterEach, describe, expect, test, vi } from "vitest";
import {
	playerQuests,
	QuestDifficulty,
	QuestId,
	QuestStatus,
} from "../../source/adventurers-log/player-quests.js";
import { RuneScapeErrorCode } from "../../source/utility/error.js";
import { stubFetch } from "../utility/stub-fetch.js";

describe("playerQuests", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test("Encodes the name in the path.", async () => {
		const fetchMock = stubFetch({ name: "Le Me", qp: 0, qp_max: 476, quests: {} });
		await playerQuests({ name: "Le Me" });

		expect(fetchMock.mock.calls[0]![0]).toBe(
			"https://secure.runescape.com/m=adventurers-log/api/v1/playerQuests/Le%20Me",
		);
	});

	test("Keys quests by their id.", async () => {
		const quest = {
			difficulty: QuestDifficulty.Novice,
			eligible: true,
			members: false,
			qp: 1,
			status: QuestStatus.Completed,
			title: "Cook's Assistant",
		};

		stubFetch({ name: "Mod Example", qp: 235, qp_max: 476, quests: { "257": quest } });
		const result = await playerQuests({ name: "mod example" });

		expect(result.name).toBe("Mod Example");
		expect(result.qp).toBe(235);
		expect(result.qpMax).toBe(476);
		expect(result.quests[QuestId.CooksAssistant]).toStrictEqual(quest);
	});

	test("Throws the error code of a failure.", async () => {
		stubFetch({ error: "PLAYER_NOT_FOUND" }, 404);

		await expect(playerQuests({ name: "Name" })).rejects.toMatchObject({
			code: RuneScapeErrorCode.PlayerNotFound,
			rawCode: "PLAYER_NOT_FOUND",
		});
	});
});

import { describe, expect, test } from "vitest";
import { clanPage, clanPageRunepixels } from "../../source/miscellaneous/clan.js";

describe("clanPage", () => {
	test("Encodes spaces as %20.", () => {
		expect(clanPage("New World Order")).toBe(
			"https://services.runescape.com/m=clan-home/clan/New%20World%20Order",
		);
	});

	test("Leaves names without spaces unchanged.", () => {
		expect(clanPage("Maxed")).toBe("https://services.runescape.com/m=clan-home/clan/Maxed");
	});
});

describe("clanPageRunepixels", () => {
	test("Replaces spaces with hyphens.", () => {
		expect(clanPageRunepixels("New World Order")).toBe(
			"https://runepixels.com/clans/New-World-Order",
		);
	});

	test("Leaves names without spaces unchanged.", () => {
		expect(clanPageRunepixels("Maxed")).toBe("https://runepixels.com/clans/Maxed");
	});
});

import { describe, expect, test } from "vitest";
import { Minigame, minigameSpotlight } from "../source/minigame-spotlight.js";

describe("minigameSpotlight", () => {
	describe("Error handling.", () => {
		test("Throws RangeError for timestamps before 18th May 2015.", () => {
			const timestamp = Date.UTC(2015, 4, 17, 23, 59, 59);
			expect(() => minigameSpotlight(timestamp)).toThrow(RangeError);
			expect(() => minigameSpotlight(timestamp)).toThrow(
				"Minigame spotlight did not exist before 18th May 2015.",
			);
		});

		test("Returns valid result at exactly the start time.", () => {
			const timestamp = Date.UTC(2015, 4, 18, 0, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.PestControl);
		});
	});

	describe("Initial rotation (May 2015).", () => {
		test("Returns Pest Control at the very start (18th May 2015 00:00 UTC).", () => {
			const timestamp = Date.UTC(2015, 4, 18, 0, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.PestControl);
		});

		test("Returns Soul Wars 3 days later (21st May 2015 00:00 UTC).", () => {
			const timestamp = Date.UTC(2015, 4, 21, 0, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.SoulWars);
		});

		test("Returns Fist of Guthix 6 days later (24th May 2015 00:00 UTC).", () => {
			const timestamp = Date.UTC(2015, 4, 24, 0, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.FistOfGuthix);
		});

		test("Returns Castle Wars at end of first cycle (4th August 2015 00:00 UTC).", () => {
			// Period 26 (last of first cycle): 26 * 3 days = 78 days after start.
			const timestamp = Date.UTC(2015, 7, 4, 0, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.CastleWars);
		});

		test("Returns Pest Control at start of second cycle (7th August 2015 00:00 UTC).", () => {
			// Period 27 (first of second cycle): wraps to index 0.
			const timestamp = Date.UTC(2015, 7, 7, 0, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.PestControl);
		});
	});

	describe("Around the sequence change (December 2018).", () => {
		test("Returns Castle Wars before the game update (2nd December 2018 23:59 UTC).", () => {
			// Period 431 (index 26 = Castle Wars in both sequences).
			const timestamp = Date.UTC(2018, 11, 2, 23, 59, 59);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.CastleWars);
		});

		test("Returns Castle Wars on rotation start (3rd December 2018 00:00 UTC).", () => {
			// Same rotation period, original sequence still active.
			const timestamp = Date.UTC(2018, 11, 3, 0, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.CastleWars);
		});

		test("Returns Castle Wars before the game update (3rd December 2018 13:59 UTC).", () => {
			// Still using original sequence.
			const timestamp = Date.UTC(2018, 11, 3, 13, 59, 59);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.CastleWars);
		});

		test("Returns Castle Wars at game update time (3rd December 2018 14:00 UTC).", () => {
			// Switches to modified sequence, but same minigame (index 26 in both).
			const timestamp = Date.UTC(2018, 11, 3, 14, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.CastleWars);
		});

		test("Returns Pest Control at next rotation (6th December 2018 00:00 UTC).", () => {
			// Period 432 (index 0 = Pest Control).
			const timestamp = Date.UTC(2018, 11, 6, 0, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.PestControl);
		});

		test("Returns Soul Wars at index 12 after enough rotations (modified sequence).", () => {
			// Period 444 (index 12 = Soul Wars in modified sequence, would be Mobilising Armies in original).
			const timestamp = Date.UTC(2019, 0, 9, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.SoulWars);
		});
	});

	describe("Further rotations.", () => {
		test("Returns Soul Wars on 24th November 2025.", () => {
			const timestamp = Date.UTC(2025, 10, 24, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.SoulWars);
		});

		test("Returns Barbarian Assault on 27th November 2025.", () => {
			const timestamp = Date.UTC(2025, 10, 27, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.BarbarianAssault);
		});

		test("Returns Conquest on 30th November 2025.", () => {
			const timestamp = Date.UTC(2025, 10, 30, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.Conquest);
		});

		test("Returns Fist of Guthix on 3rd December 2025.", () => {
			const timestamp = Date.UTC(2025, 11, 3, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.FistOfGuthix);
		});

		test("Returns Castle Wars on 6th December 2025.", () => {
			const timestamp = Date.UTC(2025, 11, 6, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.CastleWars);
		});

		test("Returns Pest Control on 9th December 2025.", () => {
			const timestamp = Date.UTC(2025, 11, 9, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.PestControl);
		});

		test("Returns Soul Wars on 12th December 2025.", () => {
			const timestamp = Date.UTC(2025, 11, 12, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.SoulWars);
		});

		test("Returns Fishing Trawler on 15th December 2025.", () => {
			const timestamp = Date.UTC(2025, 11, 15, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.FishingTrawler);
		});

		test("Returns The Great Orb Project on 18th December 2025.", () => {
			const timestamp = Date.UTC(2025, 11, 18, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.TheGreatOrbProject);
		});

		test("Returns Flash Powder Factory on 21st December 2025.", () => {
			const timestamp = Date.UTC(2025, 11, 21, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.FlashPowderFactory);
		});

		test("Returns Stealing Creation on 24th December 2025.", () => {
			const timestamp = Date.UTC(2025, 11, 24, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.StealingCreation);
		});

		test("Returns Cabbage Facepunch Bonanza on 27th December 2025.", () => {
			const timestamp = Date.UTC(2025, 11, 27, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.CabbageFacepunchBonanza);
		});

		test("Returns Heist on 30th December 2025.", () => {
			const timestamp = Date.UTC(2025, 11, 30, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.Heist);
		});

		test("Returns Trouble Brewing on 2nd January 2026.", () => {
			const timestamp = Date.UTC(2026, 0, 2, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.TroubleBrewing);
		});

		test("Returns Castle Wars on 5th January 2026.", () => {
			const timestamp = Date.UTC(2026, 0, 5, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.CastleWars);
		});

		test("Returns Pest Control on 8th January 2026.", () => {
			const timestamp = Date.UTC(2026, 0, 8, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.PestControl);
		});

		test("Returns Soul Wars on 11th January 2026.", () => {
			const timestamp = Date.UTC(2026, 0, 11, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.SoulWars);
		});

		test("Returns Fist of Guthix on 14th January 2026.", () => {
			const timestamp = Date.UTC(2026, 0, 14, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.FistOfGuthix);
		});

		test("Returns Barbarian Assault on 17th January 2026.", () => {
			const timestamp = Date.UTC(2026, 0, 17, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.BarbarianAssault);
		});

		test("Returns Conquest on 20th January 2026.", () => {
			const timestamp = Date.UTC(2026, 0, 20, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.Conquest);
		});

		test("Returns Fishing Trawler on 23rd January 2026.", () => {
			const timestamp = Date.UTC(2026, 0, 23, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.FishingTrawler);
		});

		test("Returns The Great Orb Project on 26th January 2026.", () => {
			const timestamp = Date.UTC(2026, 0, 26, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.TheGreatOrbProject);
		});

		test("Returns Flash Powder Factory on 29th January 2026.", () => {
			const timestamp = Date.UTC(2026, 0, 29, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.FlashPowderFactory);
		});

		test("Returns Castle Wars on 1st February 2026.", () => {
			const timestamp = Date.UTC(2026, 1, 1, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.CastleWars);
		});

		test("Returns Stealing Creation on 4th February 2026.", () => {
			const timestamp = Date.UTC(2026, 1, 4, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.StealingCreation);
		});

		test("Returns Cabbage Facepunch Bonanza on 7th February 2026.", () => {
			const timestamp = Date.UTC(2026, 1, 7, 12, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.CabbageFacepunchBonanza);
		});
	});

	describe("Edge cases.", () => {
		test("Handles the last second before a rotation changes.", () => {
			// Last second of Heist period (ends at 00:00 UTC on 24th).
			const timestamp = Date.UTC(2025, 10, 23, 23, 59, 59);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.Heist);
		});

		test("Handles the first second of a new rotation.", () => {
			// First second of Soul Wars period (starts at 00:00 UTC on 24th).
			const timestamp = Date.UTC(2025, 10, 24, 0, 0, 0);
			expect(minigameSpotlight(timestamp)).toBe(Minigame.SoulWars);
		});

		test("Handles timestamps within the same 3-day period.", () => {
			// All should be Heist (21st Nov 00:00 to 24th Nov 00:00).
			const day1 = Date.UTC(2025, 10, 21, 14, 0, 0);
			const day2 = Date.UTC(2025, 10, 22, 18, 30, 0);
			const day3 = Date.UTC(2025, 10, 23, 23, 59, 59);

			expect(minigameSpotlight(day1)).toBe(Minigame.Heist);
			expect(minigameSpotlight(day2)).toBe(Minigame.Heist);
			expect(minigameSpotlight(day3)).toBe(Minigame.Heist);
		});
	});
});

import { describe, expect, test } from "vitest";
import { WildernessFlashEvent, wildernessFlashEvent } from "../source/wilderness-flash-event.js";

describe("wildernessFlashEvent", () => {
	describe("Error handling.", () => {
		test("Throws RangeError for timestamps before 17th October 2022.", () => {
			const timestamp = Date.UTC(2022, 9, 17, 10, 59, 59);
			expect(() => wildernessFlashEvent(timestamp)).toThrowError(RangeError);
		});

		test("Returns valid result at exactly the start time.", () => {
			const timestamp = Date.UTC(2022, 9, 17, 11, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.SpiderSwarm);
		});
	});

	describe("Original sequence (October 2022–February 2024).", () => {
		test("Returns Spider Swarm on 17th October 2022 11:00.", () => {
			const timestamp = Date.UTC(2022, 9, 17, 11, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.SpiderSwarm);
		});

		test("Returns Unnatural Outcrop on 17th October 2022 12:00", () => {
			const timestamp = Date.UTC(2022, 9, 17, 12, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.UnnaturalOutcrop);
		});

		test("Returns Demon Stragglers on 17th October 2022 13:00", () => {
			const timestamp = Date.UTC(2022, 9, 17, 13, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.DemonStragglers);
		});

		test("Returns Butterfly Swarm on 17th October 2022 14:00", () => {
			const timestamp = Date.UTC(2022, 9, 17, 14, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.ButterflySwarm);
		});

		test("Returns King Black Dragon Rampage on 17th October 2022 15:00", () => {
			const timestamp = Date.UTC(2022, 9, 17, 15, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.KingBlackDragonRampage);
		});

		test("Returns Evil Bloodwood Tree on 17th October 2022 23:00.", () => {
			const timestamp = Date.UTC(2022, 9, 17, 23, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.EvilBloodwoodTree);
		});

		test("Returns Spider Swarm on 18th October 2022 00:00.", () => {
			const timestamp = Date.UTC(2022, 9, 18, 0, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.SpiderSwarm);
		});

		test("Returns Butterfly Swarm on 1st January 2024 12:00", () => {
			const timestamp = Date.UTC(2024, 0, 1, 12, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.ButterflySwarm);
		});
	});

	describe("Around the sequence change (February 2024).", () => {
		test("Returns Ramokee Incursion on 5th February 2024 11:00.", () => {
			// Last hour before the change (still original sequence).
			const timestamp = Date.UTC(2024, 1, 5, 11, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.RamokeeIncursion);
		});

		test("Returns King Black Dragon Rampage on 5th February 2024 12:00.", () => {
			// Switches to modified sequence.
			const timestamp = Date.UTC(2024, 1, 5, 12, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.KingBlackDragonRampage);
		});

		test("Returns Forgotten Soldiers on 5th February 2024 13:00", () => {
			const timestamp = Date.UTC(2024, 1, 5, 13, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.ForgottenSoldiers);
		});

		test("Returns Surprising Seedlings on 5th February 2024 14:00", () => {
			const timestamp = Date.UTC(2024, 1, 5, 14, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.SurprisingSeedlings);
		});

		test("Returns Stryke the Wyrm (new event) on 5th February 2024 23:00", () => {
			const timestamp = Date.UTC(2024, 1, 5, 23, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.StrykeTheWyrm);
		});

		test("Returns Butterfly Swarm on 6th February 2024 01:00", () => {
			const timestamp = Date.UTC(2024, 1, 6, 1, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.ButterflySwarm);
		});

		test("Returns King Black Dragon Rampage on 6th February 2024 02:00", () => {
			const timestamp = Date.UTC(2024, 1, 6, 2, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.KingBlackDragonRampage);
		});
	});

	describe("Further rotations.", () => {
		test("Returns Lost Souls on 27th November 2025 15:00", () => {
			const timestamp = Date.UTC(2025, 10, 27, 15, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.LostSouls);
		});

		test("Returns Ramokee Incursion on 27th November 2025 16:00", () => {
			const timestamp = Date.UTC(2025, 10, 27, 16, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.RamokeeIncursion);
		});

		test("Returns Displaced Energy on 27th November 2025 17:00", () => {
			const timestamp = Date.UTC(2025, 10, 27, 17, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.DisplacedEnergy);
		});

		test("Returns Evil Bloodwood Tree on 27th November 2025 18:00", () => {
			const timestamp = Date.UTC(2025, 10, 27, 18, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.EvilBloodwoodTree);
		});

		test("Returns Spider Swarm on 27th November 2025 19:00", () => {
			const timestamp = Date.UTC(2025, 10, 27, 19, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.SpiderSwarm);
		});

		test("Returns Unnatural Outcrop on 27th November 2025 20:00", () => {
			const timestamp = Date.UTC(2025, 10, 27, 20, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.UnnaturalOutcrop);
		});

		test("Returns Stryke the Wyrm on 27th November 2025 21:00", () => {
			const timestamp = Date.UTC(2025, 10, 27, 21, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.StrykeTheWyrm);
		});

		test("Returns Demon Stragglers on 27th November 2025 22:00", () => {
			const timestamp = Date.UTC(2025, 10, 27, 22, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.DemonStragglers);
		});

		test("Returns Butterfly Swarm on 27th November 2025 23:00", () => {
			const timestamp = Date.UTC(2025, 10, 27, 23, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.ButterflySwarm);
		});

		test("Returns King Black Dragon Rampage on 28th November 2025 00:00", () => {
			const timestamp = Date.UTC(2025, 10, 28, 0, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.KingBlackDragonRampage);
		});

		test("Returns Forgotten Soldiers on 28th November 2025 01:00", () => {
			const timestamp = Date.UTC(2025, 10, 28, 1, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.ForgottenSoldiers);
		});

		test("Returns Surprising Seedlings on 28th November 2025 02:00", () => {
			const timestamp = Date.UTC(2025, 10, 28, 2, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.SurprisingSeedlings);
		});

		test("Returns Hellhound Pack on 28th November 2025 03:00", () => {
			const timestamp = Date.UTC(2025, 10, 28, 3, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.HellhoundPack);
		});

		test("Returns Infernal Star on 28th November 2025 04:00", () => {
			const timestamp = Date.UTC(2025, 10, 28, 4, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.InfernalStar);
		});
	});

	describe("Edge cases.", () => {
		test("Handles the last second before an event changes.", () => {
			// Last second of Lost Souls (ends at 16:00 on 27th).
			const timestamp = Date.UTC(2025, 10, 27, 15, 59, 59);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.LostSouls);
		});

		test("Handles the first second of a new event.", () => {
			// First second of Ramokee Incursion (starts at 16:00 on 27th).
			const timestamp = Date.UTC(2025, 10, 27, 16, 0, 0);
			expect(wildernessFlashEvent(timestamp)).toBe(WildernessFlashEvent.RamokeeIncursion);
		});

		test("Handles timestamps within the same hour.", () => {
			// All should be Lost Souls (15:00 to 16:00).
			const early = Date.UTC(2025, 10, 27, 15, 0, 0);
			const middle = Date.UTC(2025, 10, 27, 15, 30, 0);
			const late = Date.UTC(2025, 10, 27, 15, 59, 59);

			expect(wildernessFlashEvent(early)).toBe(WildernessFlashEvent.LostSouls);
			expect(wildernessFlashEvent(middle)).toBe(WildernessFlashEvent.LostSouls);
			expect(wildernessFlashEvent(late)).toBe(WildernessFlashEvent.LostSouls);
		});

		test("Handles the transition from original to modified sequence correctly.", () => {
			// Last hour of original sequence.
			const beforeChange = Date.UTC(2024, 1, 5, 11, 59, 59);

			// First hour of modified sequence.
			const afterChange = Date.UTC(2024, 1, 5, 12, 0, 0);

			const beforeEvent = wildernessFlashEvent(beforeChange);
			const afterEvent = wildernessFlashEvent(afterChange);

			// Explicitly assert both sides of the boundary.
			expect(beforeEvent).toBe(WildernessFlashEvent.RamokeeIncursion);
			expect(afterEvent).toBe(WildernessFlashEvent.KingBlackDragonRampage);
			expect(beforeEvent).not.toBe(afterEvent);
		});
	});
});

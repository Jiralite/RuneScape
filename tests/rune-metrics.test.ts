import { describe, expect, test } from "vitest";
import { standardiseProfileActivityLog } from "../source/rune-metrics.js";

describe("standardiseProfileActivityLog", () => {
	describe("Experience formatting.", () => {
		test("Formats XP number with commas and lowercase.", () => {
			const input = "124000000XP in Divination";
			const expected = "124,000,000 xp in Divination.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats large XP number with commas and lowercase.", () => {
			const input = "200000000XP in Ranged";
			const expected = "200,000,000 xp in Ranged.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats XP in different skills.", () => {
			const input = "198000000XP in Ranged";
			const expected = "198,000,000 xp in Ranged.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Handles XP with smaller numbers.", () => {
			const input = "114000000XP in Divination";
			const expected = "114,000,000 xp in Divination.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats XP in Magic skill.", () => {
			const input = "172000000XP in Magic";
			const expected = "172,000,000 xp in Magic.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats XP in Prayer skill.", () => {
			const input = "174000000XP in Prayer";
			const expected = "174,000,000 xp in Prayer.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats XP in Thieving skill.", () => {
			const input = "58000000XP in Thieving";
			const expected = "58,000,000 xp in Thieving.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats XP in Crafting skill.", () => {
			const input = "24000000XP in Crafting";
			const expected = "24,000,000 xp in Crafting.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats XP in Construction skill.", () => {
			const input = "24000000XP in Construction";
			const expected = "24,000,000 xp in Construction.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats XP in Woodcutting skill.", () => {
			const input = "26000000XP in Woodcutting";
			const expected = "26,000,000 xp in Woodcutting.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats XP in Smithing skill.", () => {
			const input = "24000000XP in Smithing";
			const expected = "24,000,000 xp in Smithing.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats XP in Cooking skill.", () => {
			const input = "22000000XP in Cooking";
			const expected = "22,000,000 xp in Cooking.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats XP in Agility skill.", () => {
			const input = "26000000XP in Agility";
			const expected = "26,000,000 xp in Agility.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats higher XP in Smithing skill.", () => {
			const input = "96000000XP in Smithing";
			const expected = "96,000,000 xp in Smithing.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Formats XP in Hunter skill.", () => {
			const input = "54000000XP in Hunter";
			const expected = "54,000,000 xp in Hunter.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});
	});

	describe("Full stop handling.", () => {
		describe("Preserving existing full stops.", () => {
			test("Preserves full stop in XP details.", () => {
				const input =
					"I now have at least 124000000 experience points in the Divination skill.";
				const expected =
					"I now have at least 124000000 experience points in the Divination skill.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in complex sentence.", () => {
				const input =
					"I killed 8 graceful followers of Armadyl, all called Kree'arra. The gods have little imagination for names.";
				const expected =
					"I killed 8 graceful followers of Armadyl, all called Kree'arra. The gods have little imagination for names.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in boss kills.", () => {
				const input = "I killed 12 Kree'arras.";
				const expected = "I killed 12 Kree'arras.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in item finds.", () => {
				const input = "I found a crystal triskelion fragment.";
				const expected = "I found a crystal triskelion fragment.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in TzKal-Zuk kills.", () => {
				const input = "I killed 2 TzKal-Zuks.";
				const expected = "I killed 2 TzKal-Zuks.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in TzKal-Zuk details.", () => {
				const input = "I killed 2 TzKal-Zuks, champions of Ful.";
				const expected = "I killed 2 TzKal-Zuks, champions of Ful.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in tormented demon kills.", () => {
				const input = "I killed 66 tormented demons.";
				const expected = "I killed 66 tormented demons.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in complex kill message.", () => {
				const input =
					"I killed 66 tormented demons, fewer tormented souls in the world must be a good thing.";
				const expected =
					"I killed 66 tormented demons, fewer tormented souls in the world must be a good thing.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in Dagannoth Kings kills.", () => {
				const input = "I killed 23 Dagannoth Kings.";
				const expected = "I killed 23 Dagannoth Kings.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in many Dagannoth Kings.", () => {
				const input = "I killed many Dagannoth Kings.";
				const expected = "I killed many Dagannoth Kings.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in Arch-Glacor kills.", () => {
				const input = "I killed 3 Arch-Glacors.";
				const expected = "I killed 3 Arch-Glacors.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in multiple Arch-Glacor kills.", () => {
				const input = "I killed 10 Arch-Glacors.";
				const expected = "I killed 10 Arch-Glacors.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in Arch-Glacor details.", () => {
				const input = "I killed 14 Giant Arch-Glacors, from the plane of Leng.";
				const expected = "I killed 14 Giant Arch-Glacors, from the plane of Leng.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in Magister kills.", () => {
				const input = "I killed 8 Magisters.";
				const expected = "I killed 8 Magisters.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in Magister details.", () => {
				const input = "I killed 8 Magisters, the unkillable holder of the Crossing.";
				const expected = "I killed 8 Magisters, the unkillable holder of the Crossing.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in Amascut kills.", () => {
				const input = "I killed 3 Amascuts.";
				const expected = "I killed 3 Amascuts.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in goddess kills.", () => {
				const input = "I killed 3 goddess' of destruction.";
				const expected = "I killed 3 goddess' of destruction.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in skeletal horror kills.", () => {
				const input = "I killed 2 skeletal horrors.";
				const expected = "I killed 2 skeletal horrors.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in drop messages.", () => {
				const input = "After killing a Abyssal demon, it dropped an abyssal whip.";
				const expected = "After killing a Abyssal demon, it dropped an abyssal whip.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in dragon helm drops.", () => {
				const input = "After killing a Abyssal lord, it dropped a dragon helm.";
				const expected = "After killing a Abyssal lord, it dropped a dragon helm.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in book loots.", () => {
				const input =
					"After defeating Amascut, the Devourer, I looted a book: Memoirs of the Devourer.";
				const expected =
					"After defeating Amascut, the Devourer, I looted a book: Memoirs of the Devourer.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in skill level-up details.", () => {
				const input = "I levelled my Crafting skill, I am now level 105.";
				const expected = "I levelled my Crafting skill, I am now level 105.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in Woodcutting level-up details.", () => {
				const input = "I levelled my Woodcutting skill, I am now level 106.";
				const expected = "I levelled my Woodcutting skill, I am now level 106.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in Smithing level-up details.", () => {
				const input = "I levelled my Smithing skill, I am now level 105.";
				const expected = "I levelled my Smithing skill, I am now level 105.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in pet finds.", () => {
				const input = "I found Smithy, the Smithing pet.";
				const expected = "I found Smithy, the Smithing pet.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in pet find details.", () => {
				const input = "While skilling, I found Smithy, the Smithing pet.";
				const expected = "While skilling, I found Smithy, the Smithing pet.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in quest details.", () => {
				const input =
					"I solved the mystery behind Duke Hoarse's murder, and unraveled a plot to assassinate King Roald.";
				const expected =
					"I solved the mystery behind Duke Hoarse's murder, and unraveled a plot to assassinate King Roald.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in Eclipse quest details.", () => {
				const input =
					"I ended Amascut's campaign against mortal life, destroying her army and proving to her that mortal souls can be worthy. The desert can finally heal.";
				const expected =
					"I ended Amascut's campaign against mortal life, destroying her army and proving to her that mortal souls can be worthy. The desert can finally heal.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in quest points details.", () => {
				const input =
					"Completing Eclipse of the Heart has given me enough Quest Points to pass the 460 QP milestone.";
				const expected =
					"Completing Eclipse of the Heart has given me enough Quest Points to pass the 460 QP milestone.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in easy treasure trail details.", () => {
				const input = "I have completed an easy treasure trail. I got some flared trousers out of it.";
				const expected =
					"I have completed an easy treasure trail. I got some flared trousers out of it.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in treasure trail with wizard robe.", () => {
				const input = "I have completed an easy treasure trail. I got a wizard robe (g) out of it.";
				const expected = "I have completed an easy treasure trail. I got a wizard robe (g) out of it.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in treasure trail with wizard hat.", () => {
				const input = "I have completed an easy treasure trail. I got a wizard hat (g) out of it.";
				const expected = "I have completed an easy treasure trail. I got a wizard hat (g) out of it.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in medium treasure trail details.", () => {
				const input = "I have completed a medium treasure trail. I got some ranger boots out of it.";
				const expected =
					"I have completed a medium treasure trail. I got some ranger boots out of it.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Preserves full stop in treasure trail with cat mask.", () => {
				const input = "I have completed a medium treasure trail. I got a cat mask out of it.";
				const expected = "I have completed a medium treasure trail. I got a cat mask out of it.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});
		});

		describe("Adding missing full stops.", () => {
			test("Adds full stop to item find.", () => {
				const input = "I found an Armadyl hilt";
				const expected = "I found an Armadyl hilt.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to abyssal whip drop.", () => {
				const input = "I found an abyssal whip";
				const expected = "I found an abyssal whip.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to warriors' ring drop.", () => {
				const input = "I found a warriors' ring";
				const expected = "I found a warriors' ring.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to dragon hatchet drop.", () => {
				const input = "I found a dragon hatchet";
				const expected = "I found a dragon hatchet.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to archers' ring drop.", () => {
				const input = "I found an archers' ring";
				const expected = "I found an archers' ring.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to seers' ring drop.", () => {
				const input = "I found a seers' ring";
				const expected = "I found a seers' ring.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to dragon helm drop.", () => {
				const input = "I found a dragon helm";
				const expected = "I found a dragon helm.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to book loot.", () => {
				const input = "I found a book: Memoirs of the Devourer";
				const expected = "I found a book: Memoirs of the Devourer.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to skill level-up.", () => {
				const input = "Levelled up Crafting";
				const expected = "Levelled up Crafting.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to Woodcutting level-up.", () => {
				const input = "Levelled up Woodcutting";
				const expected = "Levelled up Woodcutting.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to Smithing level-up.", () => {
				const input = "Levelled up Smithing";
				const expected = "Levelled up Smithing.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to quest completion.", () => {
				const input = "Quest complete: Murder on the Border";
				const expected = "Quest complete: Murder on the Border.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to Eclipse quest completion.", () => {
				const input = "Quest complete: Eclipse of the Heart";
				const expected = "Quest complete: Eclipse of the Heart.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to quest points milestone.", () => {
				const input = "460 Quest Points obtained";
				const expected = "460 Quest Points obtained.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to easy treasure trail.", () => {
				const input = "Easy treasure trail completed";
				const expected = "Easy treasure trail completed.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});

			test("Adds full stop to medium treasure trail.", () => {
				const input = "Medium treasure trail completed";
				const expected = "Medium treasure trail completed.";
				expect(standardiseProfileActivityLog(input)).toBe(expected);
			});
		});
	});

	describe("Space normalisation.", () => {
		test("Removes double spaces in boss kill.", () => {
			const input = "I killed  the graceful follower of Armadyl, Kree'arra.";
			const expected = "I killed the graceful follower of Armadyl, Kree'arra.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Removes double spaces in Kree'arra kill.", () => {
			const input = "I killed  Kree'arra.";
			const expected = "I killed Kree'arra.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Removes double spaces in Slayer Master kill.", () => {
			const input = "I killed  Nakatra, Devourer Eternal.";
			const expected = "I killed Nakatra, Devourer Eternal.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Removes double spaces in devourer kill.", () => {
			const input = "I killed  Kezalam, the Wanderer.";
			const expected = "I killed Kezalam, the Wanderer.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Removes double spaces in ancient wyrm kill.", () => {
			const input = "I killed  Vermyx, Brood Mother.";
			const expected = "I killed Vermyx, Brood Mother.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Removes double spaces in skeletal horror kill.", () => {
			const input = "I killed  a skeletal horror.";
			const expected = "I killed a skeletal horror.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Removes double spaces in Amascut kill.", () => {
			const input = "I killed  Amascut, the Devourer.";
			const expected = "I killed Amascut, the Devourer.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Removes double spaces in goddess kill.", () => {
			const input = "I killed  the goddess of destruction.";
			const expected = "I killed the goddess of destruction.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});
	});

	describe("Article lowercasing.", () => {
		test("Lowercases 'A' after double spaces.", () => {
			const input =
				"I killed  A Slayer Master corrupted by Amascut: Nakatra, Devourer Eternal.";
			const expected =
				"I killed a Slayer Master corrupted by Amascut: Nakatra, Devourer Eternal.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Preserves lowercase 'a' in description.", () => {
			const input = "I killed  Kezalam, a hulking dark beast turned devourer.";
			const expected = "I killed Kezalam, a hulking dark beast turned devourer.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});

		test("Lowercases 'An' after double spaces.", () => {
			const input = "I killed  An ancient wyrm, now a devourer: Vermyx, the Brood Mother.";
			const expected = "I killed an ancient wyrm, now a devourer: Vermyx, the Brood Mother.";
			expect(standardiseProfileActivityLog(input)).toBe(expected);
		});
	});
});

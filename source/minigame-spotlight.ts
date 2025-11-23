const INITIAL_TIMESTAMP = Date.UTC(2015, 4, 18);

// Mobilising Armies removal: 3rd December 2018 14:00 UTC
const CHANGE_TIMESTAMP = Date.UTC(2018, 11, 3, 14);

/**
 * @see {@link https://runescape.wiki/w/Minigames}
 */
export enum Minigame {
	/**
	 * @see {@link https://runescape.wiki/w/Pest_Control}
	 */
	PestControl = "Pest Control",
	/**
	 * @see {@link https://runescape.wiki/w/Soul_Wars}
	 */
	SoulWars = "Soul Wars",
	/**
	 * @see {@link https://runescape.wiki/w/Fist_of_Guthix}
	 */
	FistOfGuthix = "Fist of Guthix",
	/**
	 * @see {@link https://runescape.wiki/w/Barbarian_Assault}
	 */
	BarbarianAssault = "Barbarian Assault",
	/**
	 * @see {@link https://runescape.wiki/w/Conquest}
	 */
	Conquest = "Conquest",
	/**
	 * @see {@link https://runescape.wiki/w/Fishing_Trawler}
	 */
	FishingTrawler = "Fishing Trawler",
	/**
	 * @see {@link https://runescape.wiki/w/The_Great_Orb_Project}
	 */
	TheGreatOrbProject = "The Great Orb Project",
	/**
	 * @see {@link https://runescape.wiki/w/Flash_Powder_Factory}
	 */
	FlashPowderFactory = "Flash Powder Factory",
	/**
	 * @see {@link https://runescape.wiki/w/Castle_Wars}
	 */
	CastleWars = "Castle Wars",
	/**
	 * @see {@link https://runescape.wiki/w/Stealing_Creation}
	 */
	StealingCreation = "Stealing Creation",
	/**
	 * @see {@link https://runescape.wiki/w/Cabbage_Facepunch_Bonanza}
	 */
	CabbageFacepunchBonanza = "Cabbage Facepunch Bonanza",
	/**
	 * @see {@link https://runescape.wiki/w/Heist}
	 */
	Heist = "Heist",
	/**
	 * @see {@link https://runescape.wiki/w/Mobilising_Armies}
	 */
	MobilisingArmies = "Mobilising Armies",
	/**
	 * @see {@link https://runescape.wiki/w/Trouble_Brewing}
	 */
	TroubleBrewing = "Trouble Brewing",
}

// Original sequence from 18th May 2015.
const ORIGINAL_SEQUENCE = [
	Minigame.PestControl,
	Minigame.SoulWars,
	Minigame.FistOfGuthix,
	Minigame.BarbarianAssault,
	Minigame.Conquest,
	Minigame.FishingTrawler,
	Minigame.TheGreatOrbProject,
	Minigame.FlashPowderFactory,
	Minigame.CastleWars,
	Minigame.StealingCreation,
	Minigame.CabbageFacepunchBonanza,
	Minigame.Heist,
	Minigame.MobilisingArmies,
	Minigame.BarbarianAssault,
	Minigame.Conquest,
	Minigame.FistOfGuthix,
	Minigame.CastleWars,
	Minigame.PestControl,
	Minigame.SoulWars,
	Minigame.FishingTrawler,
	Minigame.TheGreatOrbProject,
	Minigame.FlashPowderFactory,
	Minigame.StealingCreation,
	Minigame.CabbageFacepunchBonanza,
	Minigame.Heist,
	Minigame.TroubleBrewing,
	Minigame.CastleWars,
] as const satisfies readonly Minigame[];

// Modified sequence from 3rd December 2018 14:00 (Mobilising Armies replaced with Soul Wars).
const MODIFIED_SEQUENCE = [
	Minigame.PestControl,
	Minigame.SoulWars,
	Minigame.FistOfGuthix,
	Minigame.BarbarianAssault,
	Minigame.Conquest,
	Minigame.FishingTrawler,
	Minigame.TheGreatOrbProject,
	Minigame.FlashPowderFactory,
	Minigame.CastleWars,
	Minigame.StealingCreation,
	Minigame.CabbageFacepunchBonanza,
	Minigame.Heist,
	Minigame.SoulWars,
	Minigame.BarbarianAssault,
	Minigame.Conquest,
	Minigame.FistOfGuthix,
	Minigame.CastleWars,
	Minigame.PestControl,
	Minigame.SoulWars,
	Minigame.FishingTrawler,
	Minigame.TheGreatOrbProject,
	Minigame.FlashPowderFactory,
	Minigame.StealingCreation,
	Minigame.CabbageFacepunchBonanza,
	Minigame.Heist,
	Minigame.TroubleBrewing,
	Minigame.CastleWars,
] as const satisfies readonly Minigame[];

/**
 * Returns the minigame on spotlight.
 *
 * @remarks The sequence was modified on 3rd December 2018 when Mobilising Armies was replaced with Soul Wars.
 * @param timestamp - A Unix timestamp.
 * @throws {RangeError} If the timestamp is before 18th May 2015 00:00 UTC.
 */
export function minigameSpotlight(timestamp: number): Minigame {
	if (timestamp < INITIAL_TIMESTAMP) {
		throw new RangeError("Minigame spotlight did not exist before 18th May 2015.");
	}

	const periodsElapsed = Math.floor((timestamp - INITIAL_TIMESTAMP) / 259200000);
	const sequence = timestamp >= CHANGE_TIMESTAMP ? MODIFIED_SEQUENCE : ORIGINAL_SEQUENCE;
	return sequence[periodsElapsed % sequence.length]!;
}

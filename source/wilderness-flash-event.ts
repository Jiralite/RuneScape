const INITIAL_TIMESTAMP = Date.UTC(2_022, 9, 17, 11);

// Stryke the Wyrm added: 5th February 2024 12:00.
const CHANGE_TIMESTAMP = Date.UTC(2_024, 1, 5, 12);

/**
 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events}
 */
export enum WildernessFlashEvent {
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Spider_Swarm}
	 */
	SpiderSwarm = "Spider Swarm",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Unnatural_Outcrop}
	 */
	UnnaturalOutcrop = "Unnatural Outcrop",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Demon_Stragglers}
	 */
	DemonStragglers = "Demon Stragglers",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Butterfly_Swarm}
	 */
	ButterflySwarm = "Butterfly Swarm",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#King_Black_Dragon_Rampage}
	 */
	KingBlackDragonRampage = "King Black Dragon Rampage",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Forgotten_Soldiers}
	 */
	ForgottenSoldiers = "Forgotten Soldiers",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Surprising_Seedlings}
	 */
	SurprisingSeedlings = "Surprising Seedlings",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Hellhound_Pack}
	 */
	HellhoundPack = "Hellhound Pack",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Infernal_Star}
	 */
	InfernalStar = "Infernal Star",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Lost_Souls}
	 */
	LostSouls = "Lost Souls",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Ramokee_Incursion}
	 */
	RamokeeIncursion = "Ramokee Incursion",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Displaced_Energy}
	 */
	DisplacedEnergy = "Displaced Energy",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Evil_Bloodwood_Tree}
	 */
	EvilBloodwoodTree = "Evil Bloodwood Tree",
	/**
	 * @see {@link https://runescape.wiki/w/Wilderness_Flash_Events#Stryke_the_Wyrm}
	 */
	StrykeTheWyrm = "Stryke the Wyrm",
}

// Original sequence from 17th October 2022.
const ORIGINAL_SEQUENCE = [
	WildernessFlashEvent.SpiderSwarm,
	WildernessFlashEvent.UnnaturalOutcrop,
	WildernessFlashEvent.DemonStragglers,
	WildernessFlashEvent.ButterflySwarm,
	WildernessFlashEvent.KingBlackDragonRampage,
	WildernessFlashEvent.ForgottenSoldiers,
	WildernessFlashEvent.SurprisingSeedlings,
	WildernessFlashEvent.HellhoundPack,
	WildernessFlashEvent.InfernalStar,
	WildernessFlashEvent.LostSouls,
	WildernessFlashEvent.RamokeeIncursion,
	WildernessFlashEvent.DisplacedEnergy,
	WildernessFlashEvent.EvilBloodwoodTree,
] as const satisfies readonly WildernessFlashEvent[];

// Modified sequence from 5th February 2024 12:00 (Stryke the Wyrm added).
const MODIFIED_SEQUENCE = [
	WildernessFlashEvent.ButterflySwarm,
	WildernessFlashEvent.KingBlackDragonRampage,
	WildernessFlashEvent.ForgottenSoldiers,
	WildernessFlashEvent.SurprisingSeedlings,
	WildernessFlashEvent.HellhoundPack,
	WildernessFlashEvent.InfernalStar,
	WildernessFlashEvent.LostSouls,
	WildernessFlashEvent.RamokeeIncursion,
	WildernessFlashEvent.DisplacedEnergy,
	WildernessFlashEvent.EvilBloodwoodTree,
	WildernessFlashEvent.SpiderSwarm,
	WildernessFlashEvent.UnnaturalOutcrop,
	WildernessFlashEvent.StrykeTheWyrm,
	WildernessFlashEvent.DemonStragglers,
] as const satisfies readonly WildernessFlashEvent[];

/**
 * Returns the Wilderness Flash Event.
 *
 * @remarks The sequence was modified on 5th February 2024 12:00 when Stryke the Wyrm was added and the order changed.
 * @param timestamp - A Unix timestamp.
 * @throws {RangeError} If the timestamp is before 17th October 2022 11:00.
 */
export function wildernessFlashEvent(timestamp: number): WildernessFlashEvent {
	if (timestamp < INITIAL_TIMESTAMP) {
		throw new RangeError("Wilderness Flash Events did not exist before 17th October 2022.");
	}

	const hoursElapsed = Math.floor((timestamp - INITIAL_TIMESTAMP) / 3_600_000);
	const sequence = timestamp >= CHANGE_TIMESTAMP ? MODIFIED_SEQUENCE : ORIGINAL_SEQUENCE;
	return sequence[hoursElapsed % sequence.length]!;
}

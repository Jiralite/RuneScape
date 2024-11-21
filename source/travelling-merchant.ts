import { nextInt, runedate as utilityRunedate } from "./utility/functions.js";

/**
 * Represents an item used in the shop.
 */
export enum Item {
	AdvancedPulseCore = "Advanced pulse core",
	AnimaCrystal = "Anima crystal",
	BarrelOfBait = "Barrel of bait",
	BrokenFishingRod = "Broken fishing rod",
	CrystalTriskelion = "Crystal triskelion",
	DDTokenDaily = "D&D token (daily)",
	DDTokenMonthly = "D&D token (monthly)",
	DDTokenWeekly = "D&D token (weekly)",
	DeathtouchedDart = "Deathtouched dart",
	DragonkinLamp = "Dragonkin Lamp",
	DungeoneeringWildcard = "Dungeoneering Wildcard",
	GiftForTheReaper = "Gift for the Reaper",
	GoebieBurialCharm = "Goebie burial charm",
	HarmonicDust = "Harmonic dust",
	HornOfHonour = "Horn of honour",
	LargeGoebieBurialCharm = "Large goebie burial charm",
	LividPlant = "Livid plant",
	MenaphiteGiftOfferingLarge = "Menaphite gift offering (large)",
	MenaphiteGiftOfferingMedium = "Menaphite gift offering (medium)",
	MenaphiteGiftOfferingSmall = "Menaphite gift offering (small)",
	MessageInABottle = "Message in a bottle",
	SacredClay = "Sacred clay",
	ShatteredAnima = "Shattered anima",
	SilverhawkDown = "Silverhawk down",
	SlayerVIPCoupon = "Slayer VIP coupon",
	SmallGoebieBurialCharm = "Small goebie burial charm",
	StarvedAncientEffigy = "Starved ancient effigy",
	Taijitu = "Taijitu",
	TangledFishbowl = "Tangled fishbowl",
	UnfocusedDamageEnhancer = "Unfocused damage enhancer",
	UnfocusedRewardEnhancer = "Unfocused reward enhancer",
	UnstableAirRune = "Unstable air rune",
}

const SLOT_1_AND_2 = [
	Item.GiftForTheReaper,
	Item.BrokenFishingRod,
	Item.BarrelOfBait,
	Item.AnimaCrystal,
	Item.SmallGoebieBurialCharm,
	Item.GoebieBurialCharm,
	Item.MenaphiteGiftOfferingSmall,
	Item.MenaphiteGiftOfferingMedium,
	Item.ShatteredAnima,
	Item.DDTokenDaily,
	Item.SacredClay,
	Item.LividPlant,
	Item.SlayerVIPCoupon,
	Item.SilverhawkDown,
	Item.UnstableAirRune,
	Item.AdvancedPulseCore,
	Item.TangledFishbowl,
	Item.UnfocusedDamageEnhancer,
	Item.HornOfHonour,
] as const;

const SLOTS = {
	1: SLOT_1_AND_2,
	2: SLOT_1_AND_2,
	3: [
		Item.Taijitu,
		Item.LargeGoebieBurialCharm,
		Item.MenaphiteGiftOfferingLarge,
		Item.DDTokenWeekly,
		Item.DDTokenMonthly,
		Item.DungeoneeringWildcard,
		Item.MessageInABottle,
		Item.CrystalTriskelion,
		Item.StarvedAncientEffigy,
		Item.DeathtouchedDart,
		Item.DragonkinLamp,
		Item.HarmonicDust,
		Item.UnfocusedRewardEnhancer,
	],
} as const;

/**
 * Retrieves the index used to locate an item for a slot.
 *
 * @param runedate - The Runedate.
 * @param n1 - The first number.
 * @param n2 - The second number.
 * @returns An index used to locate an item for a slot.
 * @internal
 */
function getSlots(runedate: number, n1: number, n2: bigint) {
	const seed = runedate * 2 ** 32 + (runedate % n1);
	return nextInt(BigInt(seed), n2);
}

/**
 * Returns the first slot of the stock.
 *
 * @param runedate - A Runedate.
 * @returns The first slot of the stock.
 * @internal
 */
function slot1(runedate: number) {
	const index = Number(getSlots(runedate, 3, 19n));
	return SLOTS[1][index];
}

/**
 * Returns the second slot of the stock.
 *
 * @param runedate - A Runedate.
 * @returns The second slot of the stock.
 * @internal
 */
function slot2(runedate: number) {
	const index = Number(getSlots(runedate, 8, 19n));
	return SLOTS[2][index];
}

/**
 * Returns the third slot of the stock.
 *
 * @param runedate - A Runedate.
 * @returns The third slot of the stock.
 * @internal
 */
function slot3(runedate: number) {
	const index = Number(getSlots(runedate, 5, 13n));
	return SLOTS[3][index];
}

/**
 * Returns the stock for the travelling merchant.
 *
 * @param timestamp - A Unix timestamp.
 * @returns An array containing the stock.
 */
export function stock(
	timestamp: number,
): [(typeof SLOT_1_AND_2)[number], (typeof SLOT_1_AND_2)[number], (typeof SLOTS)[3][number]] {
	const currentRunedate = utilityRunedate(timestamp);
	return [slot1(currentRunedate)!, slot2(currentRunedate)!, slot3(currentRunedate)!];
}

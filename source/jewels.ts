import { nextInt, runedate } from "./utility/functions.js";

/**
 * The two jewels behind doors.
 */
export enum Jewel {
	ApmekenAmethyst = "Apmeken Amethyst",
	ScabariteCrystal = "Scabarite Crystal",
}

/**
 * Returns the accessible jewel.
 *
 * @param timestamp - A Unix timestamp.
 * @returns The accessible jewel.
 */
export function jewel(timestamp: number): Jewel | null {
	const slot = nextInt(BigInt(runedate(timestamp)) * 2n ** 32n, 5n);

	switch (slot) {
		case 0n:
			return Jewel.ScabariteCrystal;
		case 2n:
			return Jewel.ApmekenAmethyst;
		default:
			return null;
	}
}

const MULTI = 0x5deece66dn as const;
const MASK = 281_474_976_710_656n as const;
const c0 = 0xe66dn as const;
const c1 = 0xdeecn as const;
const c2 = 0x0005n as const;
const chunk = 65_536n as const;

/**
 * Returns the current Runedate.
 *
 * @param timestamp - A Unix timestamp.
 * @returns The Runedate.
 */
export function runedate(timestamp: number): number {
	return Math.floor(((timestamp - Date.UTC(2_002, 1, 27)) / 86_400_000) * 100) / 100;
}

/**
 * @param seed - The seed to use.
 * @internal
 */
function multiplyAvoidLimit(seed: bigint) {
	const s0 = seed % chunk;
	const s1 = BigInt(Math.floor(Number(seed / chunk))) % chunk;
	const s2 = BigInt(Math.floor(Number(seed / chunk / chunk)));
	let carry = 11n;
	let r0 = s0 * c0 + carry;
	carry = BigInt(Math.floor(Number(r0 / chunk)));
	r0 %= chunk;
	let r1 = s1 * c0 + s0 * c1 + carry;
	carry = BigInt(Math.floor(Number(r1 / chunk)));
	r1 %= chunk;
	let r2 = s2 * c0 + s1 * c1 + s0 * c2 + carry;
	r2 %= chunk;
	return r2 * chunk * chunk + r1 * chunk + r0;
}

/**
 * @param seed - The seed to use.
 * @param no - The number to use.
 * @param repeats - How many times to repeat.
 * @internal
 */
export function nextInt(seed: bigint, no: bigint, repeats = 1): bigint {
	let computedSeed = seed ^ (MULTI % MASK);

	for (let index = 0; index < repeats; index++) {
		computedSeed = multiplyAvoidLimit(computedSeed);
	}

	computedSeed >>= 17n;
	return computedSeed % no;
}

/**
 * Transforms a name into a variant that is able to be safely sent to an API.
 *
 * @param name - The name to transform
 * @param delimiter - The delimiter to use
 * @returns The transformed name.
 * @internal
 */
export function transformName(name: string, delimiter: string) {
	return name.replaceAll(" ", delimiter);
}

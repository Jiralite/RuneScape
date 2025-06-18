import { parse } from "csv-parse/sync";
import { RuneScapeAPIError } from "./utility/error.js";
import { makeRequest } from "./utility/make-request.js";

/**
 * Represents a rank in a clan.
 */
export enum ClanRank {
	Owner = 0,
	DeputyOwner = 1,
	Overseer = 2,
	Coordinator = 3,
	Organiser = 4,
	Administrator = 5,
	General = 6,
	Captain = 7,
	Lieutenant = 8,
	Sergeant = 9,
	Corporal = 10,
	Recruit = 11,
}

const APIClanRankToClanRank = {
	Owner: ClanRank.Owner,
	"Deputy Owner": ClanRank.DeputyOwner,
	Overseer: ClanRank.Overseer,
	Coordinator: ClanRank.Coordinator,
	Organiser: ClanRank.Organiser,
	Administrator: ClanRank.Administrator,
	General: ClanRank.General,
	Captain: ClanRank.Captain,
	Lieutenant: ClanRank.Lieutenant,
	Sergeant: ClanRank.Sergeant,
	Corporal: ClanRank.Corporal,
	Recruit: ClanRank.Recruit,
} as const satisfies Readonly<Record<string, ClanRank>>;

/**
 * Represents a member of a clan.
 */
export interface ClanMember {
	/**
	 * The player name of the clan member.
	 */
	clanmate: string;
	/**
	 * The rank of the clan member.
	 */
	clanRank: string;
	/**
	 * The total amount of experienced gained by the clan member during their time in the clan.
	 */
	totalXP: number;
	/**
	 * Kills by this clan member.
	 *
	 * @remarks It is believed this no longer has any meaning.
	 */
	kills: number;
}

/**
 * Options to provide for fetching clan members.
 */
export interface FetchClanMembersOptions {
	/**
	 * The name of the clan.
	 */
	clanName: string;
	/**
	 * The abort signal for the fetch.
	 */
	abortSignal?: AbortSignal | undefined;
}

/**
 * Returns the Group Ironman HiScore data.
 *
 * @param options - The options to provide
 * @returns The Group Ironman HiScore data.
 */
export async function fetchClanMembers({
	clanName,
	abortSignal,
}: FetchClanMembersOptions): Promise<ClanMember[]> {
	const url = `https://secure.runescape.com/m=clan-hiscores/members_lite.ws?clanName=${clanName}`;
	const response = await makeRequest(url, abortSignal);

	if (!response.ok) {
		throw new RuneScapeAPIError("Error fetching clan members.", response.status, url);
	}

	const text = await response.text();

	return parse(text, {
		cast: (value, { column }) =>
			// Spaces in player names are "�".
			column === "clanmate"
				? value.replace(/�/g, " ")
				: column === "clanRank"
					? APIClanRankToClanRank[value as keyof typeof APIClanRankToClanRank]
					: column === "totalXP" || column === "kills"
						? Number(value)
						: value,
		columns: () => [
			{ name: "clanmate" },
			{ name: "clanRank" },
			{ name: "totalXP" },
			{ name: "kills" },
		],
		trim: true,
	});
}

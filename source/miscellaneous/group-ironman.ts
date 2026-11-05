import { RuneScapeAPIError } from "../utility/error.js";
import { makeRequest } from "../utility/make-request.js";

/**
 * Represents a Group Ironman's HiScore data.
 */
export interface GroupIronmanContent {
	/**
	 * The id of the group.
	 */
	id: number;
	/**
	 * The name of the group.
	 */
	name: string;
	/**
	 * The total experience of the group.
	 */
	groupTotalXp: number;
	/**
	 * The total level of the group.
	 */
	groupTotalLevel: number;
	/**
	 * The size of the group.
	 */
	size: number;
	/**
	 * It's not known what this represents.
	 *
	 * @experimental
	 */
	toHighlight: boolean;
	/**
	 * Whether the group is competitive.
	 */
	isCompetitive: boolean;
	/**
	 * Whether the group has founder status.
	 */
	founder: boolean;
}

/**
 * Represents a player's HiScore data.
 */
export interface GroupIronman {
	/**
	 * The total number of groups.
	 */
	totalElements: number;
	/**
	 * The total number of pages.
	 */
	totalPages: number;
	/**
	 * The size of the page.
	 */
	size: number;
	/**
	 * The results.
	 */
	content: readonly GroupIronmanContent[];
	/**
	 * Whether the results are on the first page.
	 */
	first: boolean;
	/**
	 * Whether the results are on the last page.
	 */
	last: boolean;
	/**
	 * The number of results in {@link GroupIronman.content}.
	 */
	numberOfElements: number;
	/**
	 * The page number.
	 */
	pageNumber: number;
	/**
	 * Whether there are no results in {@link GroupIronman.content}.
	 */
	empty: boolean;
}

/**
 * Represents the options to provide for fetching the Group Ironman HiScores.
 */
export interface GroupIronmanHiScoreOptions {
	/**
	 * The group size.
	 */
	groupSize: 1 | 2 | 3 | 4 | 5;
	/**
	 * The size of the page.
	 */
	size?: number | undefined;
	/**
	 * The page number.
	 *
	 * @remarks The page number is 0-indexed.
	 */
	page?: number | undefined;
	/**
	 * Whether the group is competitive.
	 */
	isCompetitive?: boolean | undefined;
	/**
	 * The abort signal for the fetch.
	 */
	abortSignal?: AbortSignal | undefined;
}

/**
 * Returns the Group Ironman HiScore data.
 *
 * @param options - The options to provide
 */
export async function groupIronman({
	groupSize,
	size,
	page,
	isCompetitive,
	abortSignal,
}: GroupIronmanHiScoreOptions): Promise<GroupIronman> {
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set("groupSize", String(groupSize));

	if (size !== undefined) {
		urlSearchParams.set("size", String(size));
	}

	if (page !== undefined) {
		urlSearchParams.set("page", String(page));
	}

	if (isCompetitive !== undefined) {
		urlSearchParams.set("isCompetitive", String(isCompetitive));
	}

	const url =
		`https://secure.runescape.com/m=runescape_gim_hiscores/v1/groupScores?${urlSearchParams}` as const;

	const response = await makeRequest(url, abortSignal);

	if (!response.ok) {
		throw new RuneScapeAPIError("Error fetching Group Ironman HiScore data.", response.status, url);
	}

	return response.json() as Promise<GroupIronman>;
}

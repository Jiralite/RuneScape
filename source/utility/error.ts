/**
 * Error codes that can be used to track a specific error.
 */
export const ErrorCode = {
	// Profile.
	/**
	 * The generic error when fetching a player's profile data as viewed on RuneMetrics.
	 */
	ProfileError: "ProfileError",
	/**
	 * This seems to be returned on banned players.
	 */
	ProfileNotAMember: "ProfileNotAMember",
	/**
	 * The RuneMetrics profile of this player is not public.
	 */
	ProfilePrivate: "ProfilePrivate",
	/**
	 * It is supposable this player does not exist.
	 */
	ProfileNone: "ProfileNone",
} as const;

/**
 * Messages that are associated with an error code.
 *
 * @internal
 */
const Messages = {
	/**
	 * The generic error when fetching a player's profile data as viewed on RuneMetrics.
	 */
	[ErrorCode.ProfileError]: "Failed to fetch the RuneMetrics profile of this player.",
	/**
	 * This seems to be returned on banned players.
	 */
	[ErrorCode.ProfileNotAMember]: "This player is banned.",
	/**
	 * The RuneMetrics profile of this player is not public.
	 */
	[ErrorCode.ProfilePrivate]: "This player's RuneMetrics profile is not public.",
	/**
	 * It is supposable this player does not exist.
	 */
	[ErrorCode.ProfileNone]: "Unknown player.",
} as const;

/**
 * An error returned from the API.
 */
export class RuneScapeAPIError extends Error {
	/**
	 * The status code of the error.
	 */
	public readonly statusCode: number;

	/**
	 * The fully quallified URL of the request.
	 */
	public readonly url: string;

	/**
	 * Constructs an error for the API.
	 *
	 * @param name - The name of this error
	 * @param statusCode - The status code of the error
	 * @param url - The fully quallified URL of the request
	 */
	public constructor(
		name: Error["name"],
		statusCode: RuneScapeAPIError["statusCode"],
		url: RuneScapeAPIError["url"],
	) {
		super(name);
		this.statusCode = statusCode;
		this.url = url;
	}
}

/**
 * A custom error from the library.
 */
export class RuneScapeError extends Error {
	/**
	 * The defined error code.
	 */
	public readonly code: (typeof ErrorCode)[keyof typeof ErrorCode];

	/**
	 * The raw error that yielded this error.
	 */
	public readonly rawCode: string;

	/**
	 * The fully quallified URL of the request.
	 */
	public readonly url: string;

	/**
	 * Constructs a defined error from the library.
	 *
	 * @param code - The defined error code
	 * @param rawCode - The raw error that yielded this error
	 * @param url - The fully quallified URL of the request
	 */
	public constructor(
		code: RuneScapeError["code"],
		rawCode: RuneScapeError["rawCode"],
		url: RuneScapeError["url"],
	) {
		super(Messages[code]);
		this.code = code;
		this.rawCode = rawCode;
		this.url = url;
	}

	public override get name(): string {
		return `${super.name} [${this.rawCode}]`;
	}
}

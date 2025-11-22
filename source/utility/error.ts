/**
 * Error codes that can be used to track a specific error.
 */
export enum RuneScapeErrorCode {
	/**
	 * The generic error when fetching a player's profile data as viewed on RuneMetrics.
	 */
	ProfileError = 0,
	/**
	 * This seems to be returned on banned players.
	 */
	ProfileNotAMember = 1,
	/**
	 * The RuneMetrics profile of this player is not public.
	 */
	ProfilePrivate = 2,
	/**
	 * It is supposable this player does not exist.
	 */
	ProfileNone = 3,
}

/**
 * Messages that are associated with an error code.
 *
 * @internal
 */
const Messages = {
	[RuneScapeErrorCode.ProfileError]: "Failed to fetch the RuneMetrics profile of this player.",
	[RuneScapeErrorCode.ProfileNotAMember]: "This player is banned.",
	[RuneScapeErrorCode.ProfilePrivate]: "This player's RuneMetrics profile is not public.",
	[RuneScapeErrorCode.ProfileNone]: "Unknown player.",
} as const satisfies Readonly<Record<RuneScapeErrorCode, string>>;

/**
 * An error returned from the API.
 */
export class RuneScapeAPIError extends Error {
	public override readonly name = this.constructor.name;
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
	 * @param message - The name of this error
	 * @param statusCode - The status code of the error
	 * @param url - The fully quallified URL of the request
	 */
	public constructor(
		message: Error["message"],
		statusCode: RuneScapeAPIError["statusCode"],
		url: RuneScapeAPIError["url"],
	) {
		super(message);
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
	public readonly code: RuneScapeErrorCode;

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
		return `${this.constructor.name} [${this.rawCode}]`;
	}
}

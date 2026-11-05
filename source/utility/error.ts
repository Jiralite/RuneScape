/**
 * Error codes that can be used to track a specific error.
 *
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/index.html#error-codes}
 */
export enum RuneScapeErrorCode {
	/**
	 * Internal server error.
	 */
	InternalError = 0,
	/**
	 * The provided player doesn't exist, or is otherwise hidden from public view.
	 */
	PlayerNotFound = 1,
	/**
	 * This endpoint only works for members, and the provided player is not a member.
	 */
	PlayerNotMember = 2,
}

/**
 * Messages that are associated with an error code.
 *
 * @internal
 */
const Messages = {
	[RuneScapeErrorCode.InternalError]: "The Adventurer's Log failed to fulfil this request.",
	[RuneScapeErrorCode.PlayerNotFound]: "This player does not exist or is hidden from public view.",
	[RuneScapeErrorCode.PlayerNotMember]: "This player is not a member.",
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
	 * The fully qualified URL of the request.
	 */
	public readonly url: string;

	/**
	 * Constructs an error for the API.
	 *
	 * @param message - The message of this error
	 * @param statusCode - The status code of the error
	 * @param url - The fully qualified URL of the request
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
	 * The fully qualified URL of the request.
	 */
	public readonly url: string;

	/**
	 * Constructs a defined error from the library.
	 *
	 * @param code - The defined error code
	 * @param rawCode - The raw error that yielded this error
	 * @param url - The fully qualified URL of the request
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

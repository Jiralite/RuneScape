import { RuneScapeAPIError, RuneScapeError, RuneScapeErrorCode } from "./error.js";
import { isJSONResponse, makeRequest } from "./make-request.js";

/**
 * Represents an error returned from the Adventurer's Log.
 *
 * @internal
 */
interface AdventurersLogError {
	error: string;
}

/**
 * Maps the errors returned from the Adventurer's Log to the library's error codes.
 *
 * @internal
 */
const ERROR_CODES = {
	INTERNAL_ERROR: RuneScapeErrorCode.InternalError,
	PLAYER_NOT_FOUND: RuneScapeErrorCode.PlayerNotFound,
	PLAYER_NOT_MEMBER: RuneScapeErrorCode.PlayerNotMember,
} as const satisfies Readonly<Record<string, RuneScapeErrorCode>>;

/**
 * Performs a request to the Adventurer's Log.
 *
 * @param endpoint - The endpoint to request
 * @param name - The player's name
 * @param errorMessage - The message to use when the response is not understood
 * @param abortSignal - The abort signal for the fetch
 * @internal
 */
export async function adventurersLogRequest<T>(
	endpoint: "playerEvents" | "playerQuests",
	name: string,
	errorMessage: string,
	abortSignal: AbortSignal | undefined,
): Promise<T> {
	const url =
		`https://secure.runescape.com/m=adventurers-log/api/v1/${endpoint}/${encodeURIComponent(name)}` as const;

	const response = await makeRequest(url, abortSignal);

	// The documentation states failures are always JSON, but 500s have been seen with HTML bodies.
	if (!isJSONResponse(response)) {
		throw new RuneScapeAPIError(errorMessage, response.status, url);
	}

	if (response.ok) {
		return response.json() as Promise<T>;
	}

	const { error } = (await response.json()) as AdventurersLogError;
	throw new RuneScapeError(
		ERROR_CODES[error as keyof typeof ERROR_CODES] ?? RuneScapeErrorCode.InternalError,
		error,
		url,
	);
}

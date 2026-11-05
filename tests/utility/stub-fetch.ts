import { type Mock, vi } from "vitest";

/**
 * Replaces the global fetch with one that always gives the same response.
 *
 * @param body - The response body
 * @param status - The response status
 * @param contentType - The response content type
 * @returns The mocked fetch.
 */
export function stubFetch(
	body: unknown,
	status = 200,
	contentType = "application/json",
): Mock<(url: string, options?: RequestInit) => Promise<Response>> {
	const fetchMock = vi.fn(
		async (_url: string, _options?: RequestInit) =>
			new Response(typeof body === "string" ? body : JSON.stringify(body), {
				status,
				headers: { "content-type": contentType },
			}),
	);

	vi.stubGlobal("fetch", fetchMock);
	return fetchMock;
}

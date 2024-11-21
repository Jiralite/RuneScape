export function makeRequest(url: string, abortSignal?: AbortSignal) {
	const options: RequestInit = {};

	if (abortSignal) {
		options.signal = abortSignal;
	}

	return fetch(url, options);
}

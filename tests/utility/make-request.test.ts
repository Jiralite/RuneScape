import { readFileSync } from "node:fs";
import { afterEach, describe, expect, test, vi } from "vitest";
import { VERSION } from "../../source/utility/constants.js";
import { makeRequest } from "../../source/utility/make-request.js";
import { stubFetch } from "./stub-fetch.js";

function versionIn(file: string) {
	const { version } = JSON.parse(
		readFileSync(new URL(`../../${file}`, import.meta.url), "utf8"),
	) as { version: string };

	return version;
}

describe("makeRequest", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test("Identifies the library and its version.", async () => {
		const fetchMock = stubFetch({});
		await makeRequest("https://example.com", undefined);

		expect(fetchMock.mock.calls[0]![1]?.headers).toStrictEqual({
			"User-Agent": `runescape/${VERSION} (https://github.com/Jiralite/RuneScape)`,
		});
	});
});

describe("VERSION", () => {
	test.each(["package.json", "jsr.json"])("Matches %s.", (file) => {
		expect(VERSION).toBe(versionIn(file));
	});
});

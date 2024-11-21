import { defineConfig } from "tsup";

// biome-ignore lint/style/noDefaultExport: tsup documents this.
export default defineConfig({
	entry: ["source/index.ts"],
	platform: "node",
	format: "esm",
	target: "esnext",
	skipNodeModulesBundle: true,
	clean: true,
	keepNames: true,
	dts: true,
	sourcemap: true,
	outDir: "distribution",
});

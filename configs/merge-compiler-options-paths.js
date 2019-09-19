/**
 * Given full paths to tsconfig files it returns joined list of
 * paths provided in compilerOptions.paths.
 * @param tsconfigPaths
 */
function mergeCompilerOptionsPaths(tsconfigPaths) {
	return tsconfigPaths
		.map((tsconfigPath) => require(tsconfigPath))
		.map((tsconfig) => tsconfig.compilerOptions.paths)
		.reduce((res, curr) => ({ ...res, ...curr }), {});
}

module.exports.mergeCompilerOptionsPaths = mergeCompilerOptionsPaths;

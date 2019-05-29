import { resolvePaths } from 'tscpaths';

/**
 * Applies regexp from https://regexr.com/4dlu6 to allow tree shaking
 * @returns {{transform(string): *}|{code: string, map: null}}
 */
export function instanceToPure() {
	return {
		transform(code) {
			return {
				code: code.replace(/^(export const .+ = )new/gm, (match) =>
					match.replace('new', '/*@__PURE__*/ new'),
				),
				map: null,
			};
		},
	};
}

/**
 * Replaces TypeScript @class comment with webpack @__PURE__ to allow tree shaking
 * @returns {{renderChunk(string): *}|{code: string, map: null}}
 */
export function classToPure() {
	return {
		renderChunk(code) {
			return {
				code: code.replace(/\/\*\* @class \*\//g, '/*@__PURE__*/'),
				map: null,
			};
		},
	};
}

/**
 * Rewrites paths using settings from tsconfig.json
 * @param options
 * @returns {{generateBundle(): void}}
 */
export function tscpaths(options) {
	options.project = options.project || 'tsconfig.json';
	options.src = options.src || 'src';
	options.out = options.out || 'dist';

	return {
		generateBundle() {
			resolvePaths(options);
		},
	};
}

/**
 * Fills ad-engine name and version
 * @param name
 * @param version
 * @returns {{renderChunk(string): *}|{code: string, map: null}}
 */
export function adEngineVersion(name, version) {
	return {
		renderChunk(code) {
			return {
				code: code
					.replace(/<\?= PACKAGE\(name\) \?>/g, name)
					.replace(/<\?= PACKAGE\(version\) \?>/g, version),
				map: null,
			};
		},
	};
}

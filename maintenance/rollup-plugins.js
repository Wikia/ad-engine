import { resolvePaths } from 'tscpaths';

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

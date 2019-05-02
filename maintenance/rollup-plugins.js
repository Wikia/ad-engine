import { resolvePaths } from 'tscpaths';

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

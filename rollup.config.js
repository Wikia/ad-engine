import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import {
	adEngineVersion,
	classToPure,
	instanceToPure,
	tscpaths,
} from './maintenance/rollup-plugins';

const pkg = require('./package.json');
const TSCONFIG = 'src/tsconfig.json';

const targets = {
	esm: {
		input: 'src/index.ts',
		output: { file: pkg.module, format: 'esm', sourcemap: true },
		watch: { include: 'src/**' },
		// Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
		external: [
			...Object.keys(pkg.dependencies || {}),
			...Object.keys(pkg.peerDependencies || {}),
			'rxjs/operators',
		],
		plugins: [
			instanceToPure(),
			json(),
			// Allow json resolution
			commonjs(),
			// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
			resolve(),
			// Allow node_modules resolution, so you can use 'external' to control
			// which external modules to include in the bundle
			// https://github.com/rollup/rollup-plugin-node-resolve#usage
			sourceMaps(),
			// Resolve source maps to the original source
			typescript({ useTsconfigDeclarationDir: true, tsconfig: TSCONFIG }),
			classToPure(),
			tscpaths({ out: 'dist/types', project: TSCONFIG }),
			adEngineVersion(pkg.name, pkg.version),
		],
	},
};

export default targets.esm;

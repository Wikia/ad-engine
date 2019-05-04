import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import { tscpaths, dtsBundle } from './maintenance/rollup-plugins';

const pkg = require('./package.json');
const includeTypes = !process.env.NO_TYPES;

const common = {
	watch: {
		include: 'src/**',
	},
};

const corePlugins = [
	// Allow json resolution
	json(),
	// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
	commonjs(),
	// Allow node_modules resolution, so you can use 'external' to control
	// which external modules to include in the bundle
	// https://github.com/rollup/rollup-plugin-node-resolve#usage
	resolve(),
	// Resolve source maps to the original source
	sourceMaps(),

	postcss({ extract: true }),
];

const typesPlugins = includeTypes
	? [
			dtsBundle({ main: 'dist/types/ad-engine/index.d.ts', out: 'modules/ad-engine.d.ts' }),
			dtsBundle({ main: 'dist/types/ad-products/index.d.ts', out: 'modules/ad-products.d.ts' }),
			dtsBundle({ main: 'dist/types/ad-bidders/index.d.ts', out: 'modules/ad-bidders.d.ts' }),
			dtsBundle({ main: 'dist/types/ad-services/index.d.ts', out: 'modules/ad-services.d.ts' }),
			tscpaths({ out: 'modules' }),
	  ]
	: [];

const targets = {
	esm: {
		...common,
		input: 'src/index.ts',
		output: { file: pkg.module, format: 'esm', sourcemap: true },
		// Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
		external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
		plugins: [
			...corePlugins,
			typescript({
				check: false,
				useTsconfigDeclarationDir: true,
				tsconfigOverride: { compilerOptions: { declaration: includeTypes } },
			}),
			tscpaths({ out: 'dist/types' }),
		],
	},

	modules: {
		...common,
		input: {
			'ad-engine': `src/ad-engine/index.ts`,
			'ad-products': `src/ad-products/index.ts`,
			'ad-bidders': `src/ad-bidders/index.ts`,
			'ad-services': `src/ad-services/index.ts`,
		},
		output: { dir: 'modules', format: 'esm', sourcemap: true },
		// Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
		external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
		plugins: [
			...corePlugins,
			typescript({
				check: false,
				useTsconfigDeclarationDir: true,
				tsconfigOverride: { compilerOptions: { declaration: includeTypes } },
			}),
			...typesPlugins,
		],
	},
};

const targetKeys = process.env.TARGET ? [process.env.TARGET] : Object.keys(targets);

export default targetKeys.map((key) => targets[key]);

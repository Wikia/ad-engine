const path = require('path');
const get = require('lodash/get');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { getTypeScriptLoader } = require('./configs/webpack-app.config');
const pkg = require('./package.json');

const include = [
	path.resolve(__dirname, 'src'),
	// path.resolve(__dirname, 'examples'),
	// path.resolve(__dirname, 'spec'),
	path.resolve(__dirname, 'platforms'),
];

module.exports = ({ tsconfig, tsconfigPaths, transpileOnly, reportFiles }) => ({
	mode: 'development',

	context: __dirname,

	resolve: {
		extensions: ['.ts', '.js', '.json'],
		modules: [...include, 'node_modules'],
		plugins: [
			new TsconfigPathsPlugin({ configFile: 'src/tsconfig.json' }),
			new TsconfigPathsPlugin({ configFile: 'platforms/tsconfig.json' }),
		],
	},

	module: {
		rules: [
			getTypeScriptLoader({
				include,
				tsconfig: 'tsconfig.json',
				reportFiles: ['src/**/*.ts', 'platforms/**/*.ts'],
				paths: {
					'@wikia/ad-engine': ['src/index.ts'],
					'@ad-engine/core': ['src/ad-engine'],
					'@ad-engine/services': ['src/ad-services'],
					'@ad-engine/tracking': ['src/ad-tracking'],
					'@platforms/shared': ['platforms/shared/index.ts'],
				},
				// transpileOnly,
			}),
			{
				test: /\.s?css$/,
				include,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: path.resolve(__dirname, 'src/ad-engine/log-version.ts'),
				loader: StringReplacePlugin.replace({
					replacements: [
						{
							pattern: /<\?=[ \t]*PACKAGE\(([\w\-_.]*?)\)[ \t]*\?>/gi,
							replacement: (match, p1) => get(pkg, p1),
						},
					],
				}),
			},
		],
	},
});

function mergePaths(configs) {}

const path = require('path');
const get = require('lodash/get');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const { getTypeScriptLoader } = require('./configs/webpack-app.config');
const { mergeCompilerOptionsPaths } = require('./configs/merge-compiler-options-paths');
const pkg = require('./package.json');

const include = [
	path.resolve(__dirname, 'src'),
	path.resolve(__dirname, 'platforms'),
	path.resolve(__dirname, 'examples'),
	path.resolve(__dirname, 'spec'),
];

const tsconfigs = [
	path.resolve(__dirname, 'src/tsconfig.json'),
	path.resolve(__dirname, 'platforms/tsconfig.json'),
	path.resolve(__dirname, 'examples/tsconfig.json'),
	path.resolve(__dirname, 'spec/tsconfig.json'),
];

module.exports = () => ({
	mode: 'development',

	context: __dirname,

	resolve: {
		extensions: ['.ts', '.js', '.json'],
		modules: [...include, 'node_modules'],
		plugins: [
			new TsConfigPathsPlugin({
				paths: mergeCompilerOptionsPaths(tsconfigs),
			}),
		],
	},

	module: {
		rules: [
			getTypeScriptLoader({
				include,
				reportFiles: ['src/**/*.ts', 'platforms/**/*.ts'],
				paths: mergeCompilerOptionsPaths(tsconfigs),
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

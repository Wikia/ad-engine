const path = require('path');
const get = require('lodash/get');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const { getTypeScriptLoader } = require('./configs/webpack-app.config');
const pkg = require('./package.json');

const include = [
	path.resolve(__dirname, 'src'),
	path.resolve(__dirname, 'examples'),
	path.resolve(__dirname, 'spec'),
	path.resolve(__dirname, 'platforms'),
];

const reportFiles = [
	`platforms/**/*.ts`,
	`@types/**/*`,
	`src/ad-engine/**/*.ts`,
	'src/ad-bidders/**/*.ts',
	'src/ad-services/**/*.ts',
	'src/ad-tracking/**/*.ts',
];

module.exports = ({ tsconfig, tsconfigPaths }) => ({
	mode: 'development',

	context: __dirname,

	resolve: {
		extensions: ['.ts', '.js', '.json'],
		modules: [...include, 'node_modules'],
		plugins: [new TsConfigPathsPlugin({ configFileName: tsconfigPaths })],
	},

	module: {
		rules: [
			getTypeScriptLoader({
				include,
				tsconfig,
				reportFiles,
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

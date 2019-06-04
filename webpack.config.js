const merge = require('webpack-merge');
const path = require('path');
const BuildBundlePlugin = require('./maintenance/webpack-build-bundle');
const get = require('lodash/get');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const { getTypeScriptLoader } = require('./configs/webpack-app.config');
const pkg = require('./package.json');

const INCLUDE = [
	path.resolve(__dirname, 'src'),
	path.resolve(__dirname, 'examples'),
	path.resolve(__dirname, 'spec'),
];

const TSCONFIG = 'tsconfig.json';

const babelRules = {
	test: /\.(js|ts)$/,
	use: 'babel-loader',
	include: [
		path.resolve(__dirname, 'src'),
		path.resolve(__dirname, 'spec'),
		path.resolve(__dirname, 'examples'),
	],
};

const typescriptRules = getTypeScriptLoader(INCLUDE, TSCONFIG, true);

const common = {
	context: __dirname,

	resolve: {
		extensions: ['.ts', '.js', '.json'],
		modules: [...INCLUDE, 'node_modules'],
		plugins: [new TsConfigPathsPlugin({ configFileName: TSCONFIG })],
	},

	module: {
		rules: [
			babelRules,
			{
				test: /\.s?css$/,
				include: INCLUDE,
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
};

const production = {
	mode: 'production',

	entry: {
		adEngine: './src/ad-engine/index.ts',
		adProducts: './src/ad-products/index.ts',
		adBidders: './src/ad-bidders/index.ts',
		adServices: './src/ad-services/index.ts',
	},

	externals: {
		'@wikia/ad-engine': {
			window: ['Wikia', 'adEngine'],
		},
	},

	output: {
		filename: '[name].global.js',
		library: ['Wikia', '[name]'],
		libraryTarget: 'window',
	},

	plugins: [
		new BuildBundlePlugin({
			files: {
				'dist/global-bundle.js': [
					'dist/adEngine.global.js',
					'dist/adProducts.global.js',
					'dist/adBidders.global.js',
					'dist/adServices.global.js',
					'lib/prebid.min.js',
				],
			},
		}),
	],

	devtool: 'source-map',
};

module.exports = merge(common, production);

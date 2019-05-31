const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const fs = require('fs');
const path = require('path');
const get = require('lodash/get');
const pkg = require('./package.json');

const common = {
	mode: 'development',
	context: __dirname,
	module: {
		rules: [
			{
				test: /\.(js|ts)$/,
				use: 'babel-loader',
				include: [
					path.resolve(__dirname, 'src'),
					path.resolve(__dirname, 'spec'),
					path.resolve(__dirname, 'examples'),
				],
			},
			{
				test: /\.json$/,
				loader: 'json-loader',
				type: 'javascript/auto',
				exclude: [path.resolve(__dirname, 'node_modules')],
			},
			{
				test: /\.s?css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
				exclude: [path.resolve(__dirname, 'node_modules')],
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
	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},
};

const adEngine = {
	mode: 'production',
	entry: {
		adEngine: './src/ad-engine/index.ts',
	},
	devtool: 'source-map',
	output: {
		filename: '[name].global.js',
		library: ['Wikia', 'adEngine'],
		libraryTarget: 'window',
	},
};

const adProducts = {
	mode: 'production',
	entry: {
		adProducts: './src/ad-products/index.ts',
	},
	devtool: 'source-map',
	externals: {
		'@wikia/ad-engine': {
			window: ['Wikia', 'adEngine'],
		},
	},
	output: {
		filename: '[name].global.js',
		library: ['Wikia', 'adProducts'],
		libraryTarget: 'window',
	},
};

const adBidders = {
	mode: 'production',
	entry: {
		adBidders: './src/ad-bidders/index.ts',
	},
	devtool: 'source-map',
	externals: {
		'@wikia/ad-engine': {
			window: ['Wikia', 'adEngine'],
		},
	},
	output: {
		filename: '[name].global.js',
		library: ['Wikia', 'adBidders'],
		libraryTarget: 'window',
	},
};

const adServices = {
	mode: 'production',
	entry: {
		adServices: './src/ad-services/index.ts',
	},
	devtool: 'source-map',
	externals: {
		'@wikia/ad-engine': {
			window: ['Wikia', 'adEngine'],
		},
	},
	output: {
		filename: '[name].global.js',
		library: ['Wikia', 'adServices'],
		libraryTarget: 'window',
	},
};

module.exports = function() {
	return [
		merge(common, adEngine),
		merge(common, adProducts),
		merge(common, adBidders),
		merge(common, adServices),
	];
};

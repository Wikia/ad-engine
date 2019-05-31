/* global module, require */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
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
	config: {
		mode: 'production',
		entry: {
			'ad-engine': './src/ad-engine/index.ts',
		},
		devtool: 'source-map',
		output: {
			path: path.resolve(__dirname, 'dist'),
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify('production'),
			}),
			new StringReplacePlugin(),
			new webpack.optimize.ModuleConcatenationPlugin(),
		],
	},
	targets: {
		window: {
			output: {
				filename: '[name].global.js',
				library: ['Wikia', 'adEngine'],
				libraryTarget: 'window',
			},
		},
	},
};

const adProducts = {
	config: {
		mode: 'production',
		entry: {
			'ad-products': './src/ad-products/index.ts',
		},
		devtool: 'source-map',
		output: {
			path: path.resolve(__dirname, 'dist'),
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify('production'),
			}),
			new StringReplacePlugin(),
			new webpack.optimize.ModuleConcatenationPlugin(),
		],
	},
	targets: {
		window: {
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
		},
	},
};

const adBidders = {
	config: {
		mode: 'production',
		entry: {
			'ad-bidders': './src/ad-bidders/index.ts',
		},
		devtool: 'source-map',
		output: {
			path: path.resolve(__dirname, 'dist'),
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify('production'),
			}),
			new webpack.optimize.ModuleConcatenationPlugin(),
		],
	},
	targets: {
		window: {
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
		},
	},
};

const adServices = {
	config: {
		mode: 'production',
		entry: {
			'ad-services': './src/ad-services/index.ts',
		},
		devtool: 'source-map',
		output: {
			path: path.resolve(__dirname, 'dist'),
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify('production'),
			}),
			new webpack.optimize.ModuleConcatenationPlugin(),
		],
	},
	targets: {
		window: {
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
		},
	},
};

module.exports = function() {
	return [
		merge(common, adEngine.config, adEngine.targets.window),
		merge(common, adProducts.config, adProducts.targets.window),
		merge(common, adBidders.config, adBidders.targets.window),
		merge(common, adServices.config, adServices.targets.window),
	];
};

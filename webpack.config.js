const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const adEngine = {
	mode: 'production',
	entry: {
		'ad-engine': './src/ad-engine/index.ts',
	},
	devtool: 'source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
	],
	output: {
		filename: '[name].global.js',
		library: ['Wikia', 'adEngine'],
		libraryTarget: 'window',
	},
};

const adProducts = {
	mode: 'production',
	entry: {
		'ad-products': './src/ad-products/index.ts',
	},
	devtool: 'source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
	],
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
		'ad-bidders': './src/ad-bidders/index.ts',
	},
	devtool: 'source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
	],
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
		'ad-services': './src/ad-services/index.ts',
	},
	devtool: 'source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
	],
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
		merge(common('tsconfig.json'), adEngine),
		merge(common('tsconfig.json'), adProducts),
		merge(common('tsconfig.json'), adBidders),
		merge(common('tsconfig.json'), adServices),
	];
};

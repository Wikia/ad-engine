const merge = require('webpack-merge');
const common = require('./webpack.common.js');

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
		merge(common('tsconfig.json'), adEngine),
		merge(common('tsconfig.json'), adProducts),
		merge(common('tsconfig.json'), adBidders),
		merge(common('tsconfig.json'), adServices),
	];
};

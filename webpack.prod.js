const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BuildBundlePlugin = require('./maintenance/webpack-build-bundle');

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
				'global-bundle.js': [
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

module.exports = merge(common('tsconfig.json'), production);

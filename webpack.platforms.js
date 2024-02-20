const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const common = require('./webpack.common.js');

const platforms = ({ entry }, bundleAnalyzer = false) => ({
	entry,

	output: {
		filename: '[name].js',
		chunkFilename: '[name].js',
		path: path.resolve(__dirname, 'dist/platforms'),
	},

	optimization: {
		splitChunks: {
			maxInitialRequests: 1,
			maxAsyncRequests: 1,
			cacheGroups: {
				defaultVendors: false,
			},
		},
	},

	plugins: [
		new MiniCssExtractPlugin(),
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
		bundleAnalyzer
			? new BundleAnalyzerPlugin({})
			: new BundleAnalyzerPlugin({
					// generate the stats.json file
					analyzerMode: 'disabled',
					generateStatsFile: true,
					statsOptions: {
						preset: 'normal',
						assets: true,
						assetsSort: 'name',
						chunks: true,
						chunkModules: false,
						modules: false,
					},
			  }),
	],

	performance: {
		maxAssetSize: 310000,
		maxEntrypointSize: 330000,
	},

	devServer: {
		allowedHosts: 'all',
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		host: 'localhost',
		hot: false,
		liveReload: false,
		port: 9000,
		static: `dist/platforms`,
	},

	devtool: 'source-map',
});

module.exports = (env, argv) => {
	return merge(
		common(),
		platforms(
			{
				entry: {
					index: ['./src/platforms/index.ts'],
				},
			},
			env && env.bundleAnalyzer && argv.mode === 'production',
		),
	);
};

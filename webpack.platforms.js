const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const platformsConfig = require('./src/platforms/platforms.json');
const common = require('./webpack.common.js');

require('dotenv').config({ path: '.env.production' });

const platforms = ({ entry }, bundleAnalyzer = false) => ({
	entry,

	output: {
		filename: ({ chunk: { name } }) => {
			return `${name.includes('/') ? name.split('/')[1] : name}/main.bundle.js`;
		},
		path: path.resolve(__dirname, `dist/platforms`),
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: ({ chunk: { name } }) => {
				return `${name.includes('/') ? name.split('/')[1] : name}/styles.css`;
			},
		}),
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
		new webpack.DefinePlugin({
			'process.env.APP_VERSION': JSON.stringify(pkg.version),
			'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
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
	if (env && env.platform && argv.mode === 'production') {
		return merge(
			common(),
			platforms(
				{
					entry: {
						[env.platform]: path.resolve(__dirname, `src/platforms/${env.platform}/index.ts`),
					},
				},
				env && env.bundleAnalyzer,
			),
		);
	}

	return merge(
		common(),
		platforms(
			{
				entry: platformsConfig.list.reduce(
					(result, platform) => ({
						...result,
						[platform]: path.resolve(__dirname, `src/platforms/${platform}/index.ts`),
					}),
					{},
				),
			},
			env && env.bundleAnalyzer,
		),
	);
};

const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const platformsConfig = require('./src/platforms/platforms.json');
const common = require('./webpack.common.js');

const platforms = ({ entry }) => ({
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
			platforms({
				entry: {
					[env.platform]: path.resolve(__dirname, `src/platforms/${env.platform}/index.ts`),
				},
			}),
		);
	}

	if (argv.mode === 'production') {
		return platformsConfig.list.map((platform) =>
			merge(
				common(),
				platforms({
					entry: { [platform]: path.resolve(__dirname, `src/platforms/${platform}/index.ts`) },
				}),
			),
		);
	}

	return merge(
		common(),
		platforms({
			entry: platformsConfig.list.reduce(
				(result, platform) => ({
					...result,
					[platform]: path.resolve(__dirname, `src/platforms/${platform}/index.ts`),
				}),
				{},
			),
		}),
	);
};

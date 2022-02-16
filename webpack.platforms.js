const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const platformsConfig = require('./platforms/platforms.json');
const common = require('./webpack.common.js');

const platforms = ({ entry }) => ({
	entry,

	output: {
		filename: '[name]/main.bundle.js',
		path: path.resolve(__dirname, `dist/platforms`),
	},

	plugins: [new MiniCssExtractPlugin({ filename: '[name]/styles.css' })],

	performance: {
		maxAssetSize: 310000,
		maxEntrypointSize: 330000,
	},

	devServer: {
		inline: false,
		port: 9000,
		contentBase: `dist/platforms`,
	},

	devtool: 'source-map',
});

module.exports = (env, argv) => {
	if (env && env.platform && argv.mode === 'production') {
		return merge(
			common(),
			platforms({
				entry: { [env.platform]: path.resolve(__dirname, `platforms/${env.platform}/index.ts`) },
			}),
		);
	}

	if (argv.mode === 'production') {
		return platformsConfig.list.map((platform) =>
			merge(
				common(),
				platforms({
					entry: { [platform]: path.resolve(__dirname, `platforms/${platform}/index.ts`) },
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
					[platform]: path.resolve(__dirname, `platforms/${platform}/index.ts`),
				}),
				{},
			),
		}),
	);
};

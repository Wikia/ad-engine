const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const platforms = ({ platform }) => {
	return {
		entry: path.resolve(__dirname, `platforms/${platform}/index.ts`),

		output: {
			filename: 'main.bundle.js',
			path: path.resolve(__dirname, `dist/${platform}`),
		},

		plugins: [new MiniCssExtractPlugin({ filename: 'styles.css' })],

		performance: {
			maxAssetSize: 270000,
			maxEntrypointSize: 290000,
		},

		devServer: {
			port: 9000,
			inline: false,
		},

		devtool: 'source-map',
	};
};

module.exports = ({ PLATFORM }) => {
	const tsconfig = `platforms/${PLATFORM}/tsconfig.json`;
	const reportFiles = [`platforms/${PLATFORM}/**/*.ts`];

	return merge(common({ tsconfig, reportFiles }), platforms({ platform: PLATFORM }));
};

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const platforms = {
	entry: {
		gamepedia: path.resolve(__dirname, `platforms/gamepedia/index.ts`),
		sports: path.resolve(__dirname, `platforms/sports/index.ts`),
	},

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
};

module.exports = () => {
	return merge(common(), platforms);
};

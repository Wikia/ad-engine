const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = () => ({
	module: {
		rules: [
			{
				test: /\.ts$/,
				include: [path.resolve(`src/`)],
				exclude: [/node_modules/],
				enforce: 'post',
				loader: 'istanbul-instrumenter-loader',
				options: {
					esModules: true,
				},
			},
		],
	},
	plugins: [new MiniCssExtractPlugin()],
});

module.exports = () => {
	return merge(common(), config());
};

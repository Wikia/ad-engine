const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { examplePages } = require('./maintenance/examples-pages');

const development = {
	entry: examplePages,

	output: {
		path: path.resolve(__dirname, 'examples'),
		filename: '[name]/dist/bundle.js',
	},

	plugins: [new MiniCssExtractPlugin({ filename: '[name]/dist/styles.css' })],

	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					name: 'vendor',
					filename: '[name]/dist/vendor.js',
					chunks: 'all',
				},
			},
		},
	},

	devServer: {
		inline: true,
		open: true,
		contentBase: path.resolve(__dirname, 'examples'),
	},
};

module.exports = merge(common(), development);

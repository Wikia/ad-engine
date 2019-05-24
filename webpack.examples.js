const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { examplePages } = require('./maintenance/examples-pages');

const examples = {
	mode: 'development',

	entry: examplePages,

	output: {
		path: path.resolve(__dirname, 'examples'),
		filename: '[name]/dist/bundle.js',
	},

	plugins: [
		new MiniCssExtractPlugin({ filename: '[name]/dist/styles.css' }),
		new CopyWebpackPlugin([
			{ from: path.resolve(__dirname, 'lib/prebid.min.js'), to: 'vendor/dist/prebid.min.js' },
		]),
	],
};

module.exports = merge(common('tsconfig.misc.json'), examples);

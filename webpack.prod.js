const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const production = {
	mode: 'production',

	devtool: 'source-map',

	plugins: [new MiniCssExtractPlugin({ filename: 'styles.css' })],
};

module.exports = merge(common('tsconfig.json'), production);

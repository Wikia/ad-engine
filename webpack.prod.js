const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const production = {
	mode: 'production',

	entry: './src/index.ts',

	output: {
		filename: 'index.global.js',
	},

	devtool: 'source-map',
};

module.exports = merge(common('tsconfig.json'), production);

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const production = {
	mode: 'production',

	devtool: 'source-map',
};

module.exports = merge(common('tsconfig.json'), production);

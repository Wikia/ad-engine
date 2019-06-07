const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const spec = {
	mode: 'development',
};

module.exports = merge(common('tsconfig.misc.json'), spec);

const merge = require('webpack-merge');
const examples = require('./webpack.examples.js');

const development = {
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
};

module.exports = merge(examples, development);

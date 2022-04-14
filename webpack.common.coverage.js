const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const config = () => ({
	module: {
		rules: [
			{
				test: /\.ts$/,
				enforce: 'post',
				include: [path.resolve(`src/`), path.resolve(`platforms/`)], // instrument only sources with Istanbul
				exclude: [/node_modules/],
				loader: 'istanbul-instrumenter-loader',
				options: {
					esModules: true,
				},
			},
		],
	},
});

module.exports = () => {
	return merge(common(), config());
};

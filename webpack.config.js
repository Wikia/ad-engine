/* global module, require */
/* eslint-disable no-console, import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const pkg = require('./package.json');

const common = {
	context: __dirname,
	module: {
		rules: [
			{
				test: /.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
			}
		]
	}
};

const environments = {
	production: {
		entry: {
			'ad-engine': './src/index.js'
		},
		devtool: 'source-map',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].js',
			library: 'adEngine',
			libraryTarget: 'commonjs2'
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify('production')
			})
		]
	},
	development: {
		entry: {
			'slots/animations': './examples/slots/animations/script.js',
			'slots/empty-response': './examples/slots/empty-response/script.js',
			'templates/floating-ad': './examples/templates/floating-ad/script.js',
			'utils/adblock-detect': './examples/utils/adblock-detect/script.js',
			'utils/browser-detect': './examples/utils/browser-detect/script.js',
			'video/porvata': './examples/video/porvata/script.js'
		},
		devtool: 'cheap-module-eval-source-map',
		output: {
			path: path.resolve(__dirname, 'examples'),
			filename: '[name]/dist/bundle.js'
		},
		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				filename: '[name]/dist/vendor.js'
			})
		],
		resolve: {
			alias: {
				[pkg.name]: path.join(__dirname, 'src')
			}
		}
	},
	test: {}
};

const targets = {
	amd: {
		output: {
			filename: '[name].amd.js',
			library: 'ext.wikia.adEngine3',
			libraryTarget: 'amd'
		}
	},
	commonjs: {
		externals: Object.keys(pkg.dependencies),
		output: {
			filename: '[name].js',
			library: 'adEngine',
			libraryTarget: 'commonjs2'
		}
	}
};

module.exports = function (env) {
	const isProduction = (process.env.NODE_ENV === 'production') || (env && env.production);
	const isTest = (env && env.test);

	if (isProduction) {
		return [
			merge(common, environments.production, targets.commonjs),
			merge(common, environments.production, targets.amd)
		];
	} else if (isTest) {
		return merge(common, environments.test);
	}

	return merge(common, environments.development);
};

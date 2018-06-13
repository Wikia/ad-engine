/* global module, require */
/* eslint-disable no-console, import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const get = require('lodash/get');
const pkg = require('./package.json');

const common = {
	mode: 'development',
	context: __dirname,
	module: {
		rules: [
			{
				test: /.js$/,
				use: 'babel-loader',
				include: path.resolve(__dirname, 'src')
			},
			{
				test: /\.json$/,
				loader: 'json-loader',
				type: 'javascript/auto',
				exclude: /node_modules/
			},
			{
				test: path.resolve(__dirname, 'src/index.js'),
				loader: StringReplacePlugin.replace({
					replacements: [{
						pattern: /<\?=[ \t]*PACKAGE\(([\w\-_.]*?)\)[ \t]*\?>/ig,
						replacement: (match, p1) => get(pkg, p1)
					}]
				})
			}
		]
	}
};

const environments = {
	production: {
		mode: 'production',
		entry: {
			'ad-engine': './src/index.js'
		},
		devtool: 'source-map',
		output: {
			path: path.resolve(__dirname, 'dist'),
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify('production')
			}),
			new StringReplacePlugin(),
			new webpack.optimize.ModuleConcatenationPlugin()
		]
	},
	development: {
		entry: {
			'bidders/wikia-display': './examples/bidders/wikia-display/script.js',
			'slots/animations': './examples/slots/animations/script.js',
			'slots/block-btf': './examples/slots/block-btf/script.js',
			'slots/btf-only': './examples/slots/btf-only/script.js',
			'slots/delay': './examples/slots/delay/script.js',
			'slots/empty-response': './examples/slots/empty-response/script.js',
			'slots/repeatable-slots': './examples/slots/repeatable-slots/script.js',
			'slots/viewport-conflicts': './examples/slots/viewport-conflicts/script.js',
			'templates/floating-ad': './examples/templates/floating-ad/script.js',
			'utils/block-detect': './examples/utils/block-detect/script.js',
			'utils/browser-detect': './examples/utils/browser-detect/script.js',
			'video/porvata': './examples/video/porvata/script.js'
		},
		devtool: 'cheap-module-eval-source-map',
		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						name: 'vendor',
						filename: '[name]/dist/vendor.js',
						chunks: 'all'
					}
				}
			}
		},
		output: {
			path: path.resolve(__dirname, 'examples'),
			filename: '[name]/dist/bundle.js'
		},
		plugins: [
			new StringReplacePlugin()
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
		externals: Object.keys(pkg.dependencies).map(key => new RegExp(`^${key}`)),
		output: {
			filename: '[name].js',
			library: 'adEngine',
			libraryTarget: 'commonjs2'
		},
		optimization: {
			minimize: false
		},
	},
	window: {
		output: {
			filename: '[name].global.js',
			library: ['Wikia', 'adEngine'],
			libraryTarget: 'window'
		}
	}
};

module.exports = function (env) {
	const isProduction = (process.env.NODE_ENV === 'production') || (env && env.production);
	const isTest = (env && env.test);

	if (isProduction) {
		return [
			merge(common, environments.production, targets.amd),
			merge(common, environments.production, targets.window),
			merge(common, environments.production, targets.commonjs)
		];
	} else if (isTest) {
		return merge(common, environments.test);
	}

	return merge(common, environments.development);
};

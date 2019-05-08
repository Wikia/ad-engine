const webpack = require('webpack');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const babelConfig = require('./babel-app.config');

module.exports = (env, argv, ROOT, DESTINATION) => {
	const tsconfig = env.TSCONFIG || 'tsconfig.json';

	return {
		mode: 'development',
		context: ROOT,

		entry: {
			main: './index.ts',
		},

		output: {
			filename: '[name].bundle.js',
			path: DESTINATION,
		},

		resolve: {
			extensions: ['.ts', '.js'],
			modules: [ROOT, 'node_modules'],
			plugins: [new TsConfigPathsPlugin({ configFileName: tsconfig })],
		},

		module: {
			rules: [
				/****************
				 * PRE-LOADERS
				 *****************/
				{
					enforce: 'pre',
					test: /\.js$/,
					use: 'source-map-loader',
				},
				{
					enforce: 'pre',
					test: /\.ts$/,
					exclude: /node_modules/,
					use: 'tslint-loader',
				},

				/****************
				 * LOADERS
				 *****************/
				{
					test: /\.(js|ts)$/,
					exclude: [/node_modules/],
					use: [
						{
							loader: 'awesome-typescript-loader',
							options: {
								configFileName: tsconfig,
								useBabel: true,
								babelCore: '@babel/core',
								babelOptions: {
									babelrc: false /* Important line */,
									...babelConfig,
								},
							},
						},
					],
				},

				{
					test: /\.js$/,
					include: [/node_modules/],
					use: [
						{
							loader: 'babel-loader',
							options: {
								...babelConfig,
							},
						},
					],
				},
			],
		},

		devtool: argv.mode === 'production' ? 'source-map' : 'cheap-module-source-map',
	};
};

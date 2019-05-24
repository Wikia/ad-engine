const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const { getTypeScriptLoader } = require('./configs/webpack-app.config');
const path = require('path');

const INCLUDE = [
	path.resolve(__dirname, 'src'),
	path.resolve(__dirname, 'examples'),
	path.resolve(__dirname, 'spec'),
];

module.exports = (TSCONFIG) => ({
	context: __dirname,

	resolve: {
		extensions: ['.ts', '.js', '.json'],
		modules: [...INCLUDE, 'node_modules'],
		plugins: [new TsConfigPathsPlugin({ configFileName: TSCONFIG })],
	},

	module: {
		rules: [
			getTypeScriptLoader(INCLUDE, TSCONFIG, true),
			{
				test: /\.s?css$/,
				include: INCLUDE,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},

	plugins: [new MiniCssExtractPlugin({ filename: 'styles.css' })],
});

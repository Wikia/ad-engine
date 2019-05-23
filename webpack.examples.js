const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { getPreLoaders, getTypeScriptLoader } = require('./configs/webpack-app.config');
const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');

const ROOT = __dirname;
// const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, `dist`);
const TSCONFIG = 'tsconfig.misc.json';

const examplePages = {};

function findExamplePages(startPath, filter) {
	if (!fs.existsSync(startPath)) {
		return;
	}

	const files = fs.readdirSync(startPath);

	files.forEach((file) => {
		const filename = path.join(startPath, file);
		const stat = fs.lstatSync(filename);

		if (stat.isDirectory()) {
			findExamplePages(filename, filter);
		} else if (filename.indexOf(filter) >= 0) {
			const shortName = filename.replace('examples/', '').replace('/script.ts', '');

			examplePages[shortName] = `./${filename}`;
		}
	});
}

findExamplePages('./examples', 'script.ts');

const common = {
	mode: 'development',
	context: __dirname,

	resolve: {
		extensions: ['.ts', '.js', '.json'],
		modules: [ROOT, 'node_modules'],
		plugins: [new TsConfigPathsPlugin({ configFileName: TSCONFIG })],
	},

	module: {
		rules: [
			getTypeScriptLoader(ROOT, TSCONFIG, true),
			{
				test: /\.s?css$/,
				include: ROOT,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
				exclude: [path.resolve(__dirname, 'node_modules')],
			},
		],
	},

	plugins: [new MiniCssExtractPlugin({ filename: 'styles.css' })],

	devtool: 'cheap-module-eval-source-map',
};

const development = {
	entry: examplePages,
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
	output: {
		path: path.resolve(__dirname, 'examples'),
		filename: '[name]/dist/bundle.js',
	},
	plugins: [
		new MiniCssExtractPlugin({ filename: '[name]/dist/styles.css' }),
		new CopyWebpackPlugin([
			{ from: path.resolve(__dirname, 'lib/prebid.min.js'), to: 'vendor/dist/prebid.min.js' },
		]),
	],
};

module.exports = merge(common, development);

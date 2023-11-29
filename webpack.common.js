const path = require('path');
const pkg = require('./package.json');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const include = [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'spec')];

module.exports = () => ({
	mode: 'development',
	context: __dirname,

	resolve: {
		extensions: ['.ts', '.js', '.json'],
		modules: [...include, 'node_modules'],
		plugins: [new TsConfigPathsPlugin()],
	},

	module: {
		rules: [
			{
				test: /\.(js|ts)$/,
				include,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: 'tsconfig.json',
						},
					},
				],
			},
			{
				test: /\.s?css$/,
				include,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: path.resolve(__dirname, 'src/core/log-version.ts'),
				loader: 'string-replace-loader',
				options: {
					search: '<?= PACKAGE(version) ?>',
					replace: pkg.version,
				},
			},
		],
	},

	plugins: [
		new ForkTsCheckerWebpackPlugin(),
		new WorkboxPlugin.GenerateSW({
			swDest: './sw.js',
			maximumFileSizeToCacheInBytes: 50000000,
			clientsClaim: true,
			skipWaiting: true,
		}),
	],
	watchOptions: {
		ignored: /node_modules/,
	},
	ignoreWarnings: [/export .* \((reexported|imported) as .*\) was not found in/],
});

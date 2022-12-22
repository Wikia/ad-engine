const path = require('path');
const pkg = require('./package.json');
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
		fallback: {
			util: require.resolve('util/'), // todo: remove?
		},
	},

	module: {
		rules: [
			{
				test: /\.(js|ts)$/,
				include,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [['@babel/preset-typescript', { targets: 'defaults' }]],
							plugins: [
								[
									'@babel/plugin-transform-runtime',
									{ helpers: true, corejs: 2, regenerator: true },
								],
							],
						},
					},
					{
						loader: 'ts-loader',
						options: {
							configFile: 'tsconfig.json',
							transpileOnly: true, // todo: remove to enable types
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
});

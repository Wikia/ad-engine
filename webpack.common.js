const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { mergeCompilerOptionsPaths } = require('./configs/merge-compiler-options-paths');
const pkg = require('./package.json');

const include = [
	path.resolve(__dirname, 'src'),
	path.resolve(__dirname, 'platforms'),
	path.resolve(__dirname, 'spec'),
];

const paths = mergeCompilerOptionsPaths([
	path.resolve(__dirname, 'src/tsconfig.json'),
	path.resolve(__dirname, 'platforms/tsconfig.json'),
	path.resolve(__dirname, 'spec/tsconfig.json'),
]);

module.exports = () => ({
	mode: 'development',

	context: __dirname,

	resolve: {
		alias: {
			'@ad-engine/core': path.resolve(__dirname, 'src/ad-engine'),
			'@ad-engine/services': path.resolve(__dirname, 'src/ad-services'),
			'@ad-engine/tracking': path.resolve(__dirname, 'src/ad-tracking'),
			'@ad-engine/communication': path.resolve(__dirname, 'src/communication'),
			'@ad-engine/models': path.resolve(__dirname, 'src/models'),
			'@wikia/ad-engine': path.resolve(__dirname, 'src/index.ts'),
			'@platforms/shared': path.resolve(__dirname, 'platforms/shared/index.ts'),
			'@wikia/*': path.resolve(__dirname, 'src/*'),
		},
		extensions: ['.ts', '.js', '.json'],
		modules: [...include, 'node_modules'],
		fallback: {
			util: require.resolve('util/'),
		},
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				include: include,
				options: {
					transpileOnly: true,
				},
			},
			{
				test: /\.s?css$/,
				include,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: path.resolve(__dirname, 'src/ad-engine/log-version.ts'),
				loader: 'string-replace-loader',
				options: {
					search: '<?= PACKAGE(version) ?>',
					replace: pkg.version,
				},
			},
		],
	},
	plugins: [new ForkTsCheckerWebpackPlugin()],
});

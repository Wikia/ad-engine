const babelConfig = require('./babel-app.config');

module.exports.getPreLoaders = () => {
	return [
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
	];
};

module.exports.getTypeScriptLoader = ({ include, ...options }) => {
	return {
		test: /\.(js|ts)$/,
		include: include,
		exclude: [/node_modules/],
		use: [
			{
				loader: 'awesome-typescript-loader',
				options: {
					...options,
					useBabel: true,
					babelCore: '@babel/core',
					babelOptions: {
						babelrc: false /* Important line */,
						...babelConfig,
					},
				},
			},
		],
	};
};

module.exports.getAdEngineLoader = () => {
	return {
		test: /\.js$/,
		include: [new RegExp(`ad-engine/dist/index.es5.js`)],
		use: [
			{
				loader: 'babel-loader',
				options: {
					...babelConfig,
				},
			},
		],
	};
};

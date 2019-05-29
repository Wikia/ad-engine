module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					browsers: ['last 2 versions', 'safari >= 9.0', 'ie 11', '> 2%'],
				},
				modules: false,
			},
		],
	],

	plugins: [
		[
			'@babel/plugin-transform-runtime',
			{
				helpers: true,
				corejs: 2,
				regenerator: true,
			},
		],
		'lodash',
	],
};

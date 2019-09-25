// Removed @babel/preset-env due to https://github.com/babel/babel/issues/10271#issuecomment-528379505
module.exports = {
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

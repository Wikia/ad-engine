const concat = require('concat');
const distFiles = [
	'./dist/ad-engine.global.js',
	'./dist/ad-products.global.js',
	'./dist/ad-bidders.global.js',
	'./dist/ad-services.global.js',
	'./lib/prebid.min.js',
];

concat(distFiles, './dist/global-bundle.js');

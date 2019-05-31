const concat = require('concat');
const distFiles = [
	'./dist/adEngine.global.js',
	'./dist/adProducts.global.js',
	'./dist/adBidders.global.js',
	'./dist/adServices.global.js',
	'./lib/prebid.min.js',
];

concat(distFiles, './dist/global-bundle.js');

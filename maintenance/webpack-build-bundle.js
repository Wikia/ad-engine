const concat = require('concat');

class BuildBundle {
	constructor(options) {
		this.options = options;
	}

	apply(compiler) {
		const plugin = { name: 'MergeIntoFile' };
		compiler.hooks.afterEmit.tapAsync(plugin, this.run.bind(this));
	}

	run(compilation, callback) {
		const distFiles = [
			'./dist/adEngine.global.js',
			'./dist/adProducts.global.js',
			'./dist/adBidders.global.js',
			'./dist/adServices.global.js',
			'./lib/prebid.min.js',
		];

		concat(distFiles, './dist/global-bundle.js');
		callback();
		console.log('\n', 'Global Bundle created!', '\n');
	}
}

module.exports = BuildBundle;

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
		Object.keys(this.options.files).forEach((key) => {
			concat(this.options.files[key], key);
		});

		callback();

		console.log('\n', 'Build Bundle completed!', '\n');
	}
}

module.exports = BuildBundle;

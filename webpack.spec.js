const common = require('./webpack.common.js');

module.exports = common({
	tsconfig: 'spec/tsconfig.json',
	tsconfigPaths: 'spec/tsconfig.paths.json',
	transpileOnly: true,
});

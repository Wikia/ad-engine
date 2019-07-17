const common = require('./webpack.common.js');

module.exports = common({ tsconfig: 'spec/tsconfig.json', transpileOnly: true });

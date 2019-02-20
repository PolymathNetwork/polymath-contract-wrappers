const path = require('path');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.base');

const buildConfig = merge.smart(baseConfig, {
  devtool: 'source-map',
  mode: 'production',
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    pathinfo: true,
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
    library: '@polymathnetwork/contract-wrappers',
    libraryTarget: 'commonjs2'
  }
});

module.exports = buildConfig;

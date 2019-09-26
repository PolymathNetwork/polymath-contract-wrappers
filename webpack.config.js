const path = require('path');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.base');

const browserConfig = merge.smart(baseConfig, {
  devtool: 'source-map',
  mode: 'production',
  entry: path.resolve(__dirname, './src/index.ts'),
  target: 'web',
  output: {
    pathinfo: true,
    filename: 'index.browser.js',
    path: path.resolve(__dirname, 'lib'),
    library: '@polymathnetwork/contract-wrappers',
    libraryTarget: 'commonjs2',
    globalObject: 'this',
  },
  node: {
    fs: 'empty'
  }
})

const nodeConfig = merge.smart(baseConfig, {
  devtool: 'source-map',
  mode: 'production',
  entry: path.resolve(__dirname, './src/index.ts'),
  target: 'node',
  output: {
    pathinfo: true,
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
    library: '@polymathnetwork/contract-wrappers',
    libraryTarget: 'commonjs2',
    globalObject: 'this',
  },
  externals: {
    fs: true
  }
});

module.exports = [browserConfig, nodeConfig];

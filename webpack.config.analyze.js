const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const prodConfig = require('./webpack.config');

const browserConfig = merge.smart(prodConfig[0], {
  plugins: [
    // Analyze the bundle size and its content
    new BundleAnalyzerPlugin(),
  ]
});

const nodeConfig = merge.smart(prodConfig[1], {
  plugins: [
    // Analyze the bundle size and its content
    new BundleAnalyzerPlugin(),
  ]
});

module.exports = [browserConfig, nodeConfig];

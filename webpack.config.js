const path = require("path");
const merge = require("webpack-merge");
const DeclarationBundlerPlugin = require("declaration-bundler-webpack-plugin");
const webpack = require("webpack");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const baseConfig = {
  devtool: "cheap-module-source-map",
  mode: "development",
  entry: ["@babel/polyfill"],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin(),
      new DeclarationBundlerPlugin({
        moduleName: "polymath-contract-wrappers"
      })
    ]
  },
  plugins: [new CaseSensitivePathsPlugin()],
  output: {
    pathinfo: true,
    filename: "index.js",
    path: path.resolve(__dirname, "lib"),
    publicPath: "/"
  }
};

const devServerConfig = merge.strategy({
  entry: "append",
  plugins: " append"
})(baseConfig, {
  entry: path.resolve(__dirname, "dev_sandbox.ts"),
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    watchContentBase: true,
    compress: false,
    port: process.env.PORT || 9000
  },
  output: {
    pathinfo: true,
    filename: "devServer.js",
    path: path.resolve(__dirname, "lib"),
    publicPath: "/"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Development Server"
    })
  ]
});

const bundleConfig = merge.strategy({
  entry: "append"
})(baseConfig, {
  entry: path.resolve(__dirname, "./src/index.ts")
});

module.exports = [devServerConfig, bundleConfig];

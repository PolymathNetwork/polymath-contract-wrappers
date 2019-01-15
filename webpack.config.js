const path = require("path");
const DeclarationBundlerPlugin = require("declaration-bundler-webpack-plugin");
const webpack = require("webpack");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  devtool: "cheap-module-source-map",
  mode: "development",
  entry: ["@babel/polyfill", path.resolve(__dirname, "./src/index.ts")],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    watchContentBase: true,
    compress: false,
    port: process.env.PORT || 9000
  },
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
  plugins: [
    new CaseSensitivePathsPlugin(),
    new HtmlWebpackPlugin({
      title: "Development Server"
    })
  ],
  output: {
    pathinfo: true,
    filename: "index.js",
    path: path.resolve(__dirname, "lib"),
    publicPath: "/"
  }
};

const path = require("path");
const fs = require("fs");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const baseConfig = require("./webpack.base");

// Name of the sandbox file to use for development manual testing
const SANDBOX_FILE_NAME = "sandbox.ts";

const sandboxFilePath = path.resolve(`./${SANDBOX_FILE_NAME}`);

// Create the git-ignored sandbox file if it doesn't exist yet
if (!fs.existsSync(sandboxFilePath)) {
  fs.writeFileSync(
    sandboxFilePath,
    "/* Import index.ts here and start coding! */\nconsole.log('Edit this file in sandbox.ts')"
  );
}

// webpack-merge is used to easily compose different webpack config objects
const devConfig = merge.smart(baseConfig, {
  // We specify this non-production file here to avoid it being bundled
  // on actual production builds
  entry: path.resolve(__dirname, SANDBOX_FILE_NAME),
  module: {
    // We override the ts loader to use the dev config file instead of the
    // main one
    rules: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader",
        options: {
          configFileName: "tsconfig-dev.json"
        }
      }
    ]
  },
  // Dev Server configuration
  devServer: {
    // This is not written to the disk, but has to be named anyways
    contentBase: path.join(__dirname, "dist"),
    // Turns on auto-reloads when a file changes
    watchContentBase: true,
    // Opens the browser when the watcher starts
    open: true,
    // No need for compression on development
    compress: false,
    // Port at which the dev server will run
    port: process.env.PORT || 9000
  },
  plugins: [
    // We add the HTML plugin to have an HTML file we can serve
    new HtmlWebpackPlugin({
      title: "Polymath Low Level API - Sandbox"
    })
  ],
  // Custom output file
  output: {
    pathinfo: true,
    filename: "devServer.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  node: {
    fs: 'empty'
  }
});

module.exports = devConfig;

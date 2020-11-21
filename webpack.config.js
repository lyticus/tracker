module.exports = {
  devtool: "inline-source-map",
  output: {
    filename: "index.js",
    library: "Lyticus",
    libraryTarget: "umd",
    libraryExport: "default",
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ }],
  },
};

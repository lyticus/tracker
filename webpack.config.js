const path = require('path');

module.exports = {
  entry: path.resolve(__dirname + '/src/lyticus.js'),
  output: {
    path: path.resolve(__dirname + '/dist/'),
    filename: 'lyticus.js',
    library: 'lyticus',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};

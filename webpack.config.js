const path = require('path');

module.exports = {
  entry: './src/js/builder.js',
  output: {
    filename: 'builder.js',
    path: path.resolve(__dirname, 'public/js'),
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  mode: 'development',
  devtool: 'source-map'
};
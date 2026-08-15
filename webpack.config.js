const path = require("path");

module.exports = {
  entry: "./src/js/builder.js",
  output: {
    filename: "builder.js",
    path: path.resolve(__dirname, "public/js"),
    publicPath: "auto",
  },
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "../fonts/[name][ext]",
        },
      },
    ],
  },
  mode: "production",
  devtool: "source-map",
};

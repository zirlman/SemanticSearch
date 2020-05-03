const path = require("path");

module.exports = {
  entry: "./src/search.js",
  output: {
    filename: "./js/search.js",
    path: path.resolve(__dirname, "dist"),
  },
};

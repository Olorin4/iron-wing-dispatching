//webpack.dev.js:
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        static: "./dist",
        watchFiles: ["src/frontend/**/*"],
        historyApiFallback: true, // Enable serving for single-page apps
        proxy: {
            "/api": "http://localhost:3000", // Proxy API requests to backend
        },
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
});

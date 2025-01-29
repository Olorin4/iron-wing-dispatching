//webpack.dev.js:
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        static: "./dist",
        watchFiles: ["src/**/*"],
        historyApiFallback: true, // Enable serving for single-page apps
        proxy: [
            {
                context: ["/api"], // Routes to proxy
                target: "http://localhost:3000", // Your backend server
                secure: false, // Disable SSL verification for local dev
            },
        ],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
});

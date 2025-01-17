//webpack.common.js:
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        index: "./src/frontend/index.js",
        blog: "./src/frontend/blog/blog.js",
        signup: "./src/frontend/sign-up-form/sign-up.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Iron Wing Dispatching",
            template: path.resolve(__dirname, "./src/frontend/index.html"),
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/frontend/blog/blog.html"),
            filename: "blog.html",
            chunks: ["blog"],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(
                __dirname,
                "./src/frontend/sign-up-form/sign-up.html"
            ),
            filename: "sign-up.html",
            chunks: ["signup"],
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/frontend/assets/images", to: "assets/images" },
                { from: "src/frontend/assets/fonts", to: "assets/fonts" },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/[name].[hash][ext][query]",
                },
            },
            {
                test: /\.html$/,
                use: ["html-loader"],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            "@assets": path.resolve(__dirname, "./src/frontend/assets"),
            "@shared": path.resolve(__dirname, "./src/frontend/shared"),
            config$: "./configs/app-config.js",
            react: "./vendor/react-master",
        },
        modules: [
            "node_modules",
            "bower_components",
            "shared",
            "/shared/vendor/modules",
        ],
    },
};

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        index: "./src/index.js",
        blog: "./src/blog/blog.js",
        signup: "./src/sign-up-form/sign-up.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Angelic Dispatching",
            template: path.resolve(__dirname, "./src/index.html"),
            chunks: ["index"], // Include only the index JS & CSS
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/blog/blog.html"),
            filename: "blog.html",
            chunks: ["blog"], // Include only the blog.js bundle
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(
                __dirname,
                "./src/sign-up-form/sign-up.html"
            ),
            filename: "sign-up.html",
            chunks: ["signup"], // Include only the sign-up.js bundle
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/assets/images", to: "assets/images" },
                { from: "src/assets/fonts", to: "assets/fonts" },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css", // Separate CSS files for each entry
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

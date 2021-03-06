const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: "production",
    entry: ['babel-polyfill', path.resolve(__dirname, 'server/frontend/src/index.js')],
    // Webpack will find the start of our React app and bundle from there
    output: {
        // options related to how webpack emits results 
        // where compiled files go:
        path: path.resolve(__dirname, "server/frontend/static/frontend/public/"),
        // 127.0.0.1/static/frontend/public/ where static files are served from
        // (in production using a CDN, the pattern here would be
        // STATIC_PATH/{{path after emitting}} where STATIC_PATH is wherever your
        // Django project saves static files after running collectstatic):
        publicPath: "/static/frontend/public/",
        filename: 'main.js',
        // the same one we import in index.html
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'API_KEY': JSON.stringify(process.env.API_KEY)
            }
        })
    ],
    module: {
        // configuration regarding modules
        rules: [
            {
                // regex test to find js and jsx files
                test: /\.(js|jsx)?$/,
                // don't look in the node_modules/ folder
                exclude: /node_modules/,
                // for matching files, use the babel-loader
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env"]
                    }
                },
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "svg-url-loader",
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
        ],
    },
};
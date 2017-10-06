const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = {
    entry: './src/httpClientHelper.js',

    output: {
        filename: 'index.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'httpClientHelper',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    devtool: '#source-map',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',

                options: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new UglifyJSPlugin()
    ]
};

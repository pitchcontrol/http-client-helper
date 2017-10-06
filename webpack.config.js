const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './samples/index.js',

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
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
    devServer: {
        // contentBase: path.join(__dirname, "samples"),
        compress: true
    }
};

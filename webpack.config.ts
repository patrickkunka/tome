const path    = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/factory.ts',
    output: {
        filename: 'tome.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'tome',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    plugins: [
        // new webpack.optimize.UglifyJsPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)/,
                loader: 'ts-loader'
            }
        ]
    }
};
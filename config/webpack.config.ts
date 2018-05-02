// tslint:disable:no-var-requires
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        filename: 'tome.js',
        path: path.resolve(__dirname, '../', 'dist'),
        library: 'tome',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    optimization: {
        // minimize: true
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    }
};
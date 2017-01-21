const path = require('path');

const config = {
    entry: './src/factory.js',
    plugins: [],
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'rte.js',
        sourceMapFilename: '[file].map',
        library: 'rte',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.json/,
                loader: 'json'
            },
            {
                test: /\.js$/,
                exclude: [/(node_modules)/],
                loader: 'babel'
            }
        ]
    },
    watch: true
};

module.exports = config;
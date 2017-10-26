var webpack = require('webpack');
var path = require('path');
module.exports = {
    entry: {
        'module':'./modules/@themost/angular/client.ts'
    },
    output: {
        filename: 'modules/@themost/angular/dist/themost-angular.umd.js'
    },
    devtool: 'eval-source-map',
    resolve: {
        extensions: ['.ts' ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};
var webpack = require('webpack');
var path = require('path');
module.exports = {
    entry: {
        'module':'./modules/@themost/angularjs/module.ts'
    },
    output: {
        filename: 'modules/@themost/angularjs/dist/themost-angularjs.umd.js'
    },
    externals: {
        "angular":"angular"
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
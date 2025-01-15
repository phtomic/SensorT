'use strict';
var nodeExternals = require('webpack-node-externals');
module.exports = {
    mode: "production",
    entry: './build/index.js',
    output: {
        filename: './index.js', // <-- Important
        libraryTarget: 'this' // <-- Important
    },
    target: 'node', // <-- Important
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
    ],
    externals: [nodeExternals()]
};
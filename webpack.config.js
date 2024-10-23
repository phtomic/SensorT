'use strict';

var nodeExternals = require('webpack-node-externals');
const JavaScriptObfuscator = require('webpack-obfuscator');
const obfuscate = new JavaScriptObfuscator({
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 1,
    debugProtection: true,
    debugProtectionInterval: 4000,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: true,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['rc4'],
    stringArrayIndexShift: true,
    stringArrayIndexesType: [
        'hexadecimal-number'
    ],
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 10,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 10,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 1,
    transformObjectKeys: false,
    unicodeEscapeSequence: true
}, ['index.js'])
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
        ...process.env.npm_lifecycle_event=='build'?[]:[obfuscate]
    ],
    externals: [nodeExternals()]
};
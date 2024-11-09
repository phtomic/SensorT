'use strict';
import nodeExternals from 'webpack-node-externals';

export const mode = "production";
export const entry = './build/index.js';
export const output = {
    filename: './index.js', // <-- Important
    libraryTarget: 'this' // <-- Important
};
export const target = 'node';
export const resolve = {
    extensions: ['.ts', '.tsx', '.js']
};
export const plugins = [];
export const externals = [nodeExternals()];
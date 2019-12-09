const typescript = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const dist = './dist/';
const name = 'themost_node';

module.exports = [{
    input: './src/index.ts',
    output: [
        {
            file: `${dist}${name}.cjs.js`,
            format: 'cjs'
        },
        {
            file: `${dist}${name}.esm.js`,
            format: 'esm'
        },
        {
            name: '@themost/node',
            file: `${dist}${name}.js`,
            format: 'umd'
        }
    ],
    plugins: [
        builtins(),
        typescript({
            declaration: false
        }),
        commonjs()
    ]
}];

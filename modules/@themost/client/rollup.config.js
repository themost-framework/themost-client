const typescript = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');
const dist = './dist/';
const name = 'themost-client';

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
            name: '@themost/client',
            file: `${dist}${name}.js`,
            format: 'umd'
        },
    ],
    external: [
        'url-parse',
        '@themost/xml'
    ],
    plugins: [
        typescript({
            declaration: false
        }),
        commonjs()
    ]
}];

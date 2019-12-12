const typescript = require('rollup-plugin-typescript2');
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
        }
    ],
    external: [
        'url',
        'node-fetch',
        '@themost/client'
    ],
    plugins: [
        typescript()
    ]
}];

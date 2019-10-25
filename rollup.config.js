import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import minify from 'rollup-plugin-babel-minify'
import pkg from './package.json'

export default [
    // browser-friendly UMD build
    {
        input: 'src/index',
        output: {
            name: 'dop',
            file: pkg.browser,
            // compact: true,
            format: 'umd'
        },
        plugins: [
            resolve(), // so Rollup can find `ms`
            babel({
                exclude: 'node_modules/**',
                plugins: ['transform-es2015-arrow-functions']
            }),
            commonjs(), // so Rollup can convert `ms` to an ES module
            minify({ comments: false })
        ]
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify
    // `file` and `format` for each target)
    {
        input: 'src/index',
        external: ['ms'],
        output: [
            { file: pkg.main, format: 'cjs' }
            // { file: pkg.module, format: 'es' }
        ]
    }
]

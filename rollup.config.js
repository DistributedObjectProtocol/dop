import pkg from './package.json'
// import minify from 'rollup-plugin-babel-minify'
import { uglify } from 'rollup-plugin-uglify'
import buble from '@rollup/plugin-buble'
import json from '@rollup/plugin-json'
import dop from './src/index'

export default [
    // dop.js
    {
        input: 'src/index',
        external: ['ms'],
        output: [
            { file: pkg.main, format: 'cjs' }
            // { file: pkg.module, format: 'es' }
        ],
        plugins: [json(), buble()]
    },

    // dop.umd.js
    {
        input: 'src/index',
        output: { name: 'dop', file: pkg.browser, format: 'umd' },
        plugins: [
            json(),
            buble(),
            uglify({
                mangle: {
                    reserved: Object.keys(dop.TYPE)
                }
            })
        ]
    }
]

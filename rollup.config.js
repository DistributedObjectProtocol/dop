import pkg from './package.json'
import minify from 'rollup-plugin-babel-minify'
import buble from '@rollup/plugin-buble'

export default [
    // dop.js
    {
        input: 'src/index',
        external: ['ms'],
        output: [
            { file: pkg.main, format: 'cjs' }
            // { file: pkg.module, format: 'es' }
        ],
        plugins: [buble()]
    },

    // dop.umd.js
    {
        input: 'src/index',
        output: {
            name: 'dop',
            file: pkg.browser,
            format: 'umd'
        },
        plugins: [buble(), minify({ comments: false })]
    }
]

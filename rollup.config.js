import pkg from './package.json'
// import minify from 'rollup-plugin-babel-minify'
import { uglify } from 'rollup-plugin-uglify'
import buble from '@rollup/plugin-buble'
import json from '@rollup/plugin-json'
import dop from './src/index'

export default [
    // // module/
    // {
    //     input: 'src/index',
    //     external: ['ms'],
    //     preserveModules: true,
    //     output: [{ dir: './module', format: 'es' }],
    //     plugins: [json(), buble()]
    // },

    // dop.js
    {
        input: 'src/index',
        external: ['ms'],
        output: [
            // { file: pkg.module, format: 'es' }
            {
                file: pkg.main,
                format: 'cjs',
                exports: 'named',
            },
        ],
        plugins: [json(), buble()],
    },

    // dop.umd.js
    {
        input: 'src/index',
        output: {
            name: 'dop',
            file: pkg.browser,
            format: 'umd',
            exports: 'named',
        },
        plugins: [
            json(),
            buble(),
            uglify({
                mangle: {
                    reserved: Object.keys(dop.TYPE),
                },
            }),
        ],
    },
]

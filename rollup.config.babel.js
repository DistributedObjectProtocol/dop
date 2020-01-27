import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'

const babelsetup = {
    presets: [
        [
            'es2015',
            {
                modules: false
            }
        ]
    ],
    plugins: ['external-helpers']
}

export default [
    // dop.js
    {
        input: 'src/index',
        external: ['ms'],
        output: [
            { file: pkg.main, format: 'cjs' }
            // { file: pkg.module, format: 'es' }
        ],
        plugins: [babel(babelsetup)]
    },

    // dop.min.js
    {
        input: 'src/index',
        output: {
            name: 'dop',
            file: pkg.browser,
            compact: true,
            format: 'umd'
        },
        plugins: [babel(babelsetup), minify({ comments: false })]
    }
]

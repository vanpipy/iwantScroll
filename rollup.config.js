
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve';

module.exports = {
    input: 'src/index.js',
    output: {
        file: 'dist/iwantScroll.js',
        name: 'iwantScroll',
        format: 'umd',
    },
    plugins: [
        nodeResolve(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
};

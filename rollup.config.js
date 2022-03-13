import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pack from './package.json';

export default {
  input: './src/main.js',
  external: ['react', 'react-dom'],
  output: [
    {
      // file: pack.main,
      dir: './build/esm',
      format: 'es',
      preserveModules: true,
    },
    {
      file: pack.exports.require,
      format: 'cjs',
    },
  ],
  plugins: [
    resolve(),

    babel({ babelHelpers: 'runtime', skipPreflightCheck: true, exclude: 'node_modules/**' }),
    commonjs(),
    terser(),
  ],
};

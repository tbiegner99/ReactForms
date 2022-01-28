import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pack from './package.json';

export default {
  input: './src/main.js',
  external: ['react', 'react-dom', 'react-is'],
  output: [
    {
      // file: pack.main,
      dir: './build/esm',
      format: 'es',
      preserveModules: true,
    },
    // {
    //   file: pack.main,
    //   format: 'cjs',
    // },
  ],
  plugins: [resolve(), babel({ skipPreflightCheck: true }), commonjs(), terser()],
};

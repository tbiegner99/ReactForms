import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import pack from './package.json';

export default {
  input: './src/main.js',
  output: [
    {
      file: pack.module,
      format: 'es'
    },
    {
      file: pack.main,
      format: 'cjs'
    }
  ],
  plugins: [babel({ babelHelpers: 'runtime', skipPreflightCheck: true })]
};

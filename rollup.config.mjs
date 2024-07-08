import run from '@rollup/plugin-run';
import typescript from '@rollup/plugin-typescript';

const isWatch = process.argv.includes('-w');
const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: './src/index.ts',
  output: {
    dir: './dist',
    format: 'cjs',
    sourcemap: !isProduction,
  },
  plugins: [
    typescript(),
    isWatch && run({
      options: {
        execArgv: ['--inspect']
      }
    }),
  ]
};

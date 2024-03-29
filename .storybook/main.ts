import { Configuration, DefinePlugin } from 'webpack';
import { withKnobs } from '@storybook/addon-knobs';

export default {
  stories: ['../packages/**/*.story.js', '../examples/**/*.story.js'],
  addons: [
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
  decorators: [withKnobs],
  webpackFinal: async (config: Configuration) => {
    // config.module?.rules.push({
    //   test: /\.tsx?$/,
    //   loader: 'ts-loader',
    // });

    config.resolve?.extensions?.push('.js', '.jsx');

    config.plugins?.unshift(
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    );

    if (config.performance) {
      config.performance.hints = false;
    }

    return config;
  },
};

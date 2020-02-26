import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { resolve } from '../utils/pathUtil';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const postcssPresetEnv = require('postcss-preset-env')({ browsers: 'last 2 versions', autoprefixer: { grid: true } });
const postCssOptions = {
    plugins: [postcssPresetEnv]
};

export default function(options: ConfigOptions) {
    const { webpackConfig } = global;
    const { isProd } = options;

    webpackConfig.module
        .rule('css')
        .test(/\.css$/)
        .include.add(/node_modules/)
        .end()
        .when(
            isProd,
            config =>
                config
                    .use('mini-css')
                    .loader(MiniCssExtractPlugin.loader)
                    .options({ publicPath: '../' }),
            config => config.use('style-loader').loader(require.resolve('style-loader'))
        )
        .use('css-loader')
        .loader(require.resolve('css-loader'))
        .end()
        .when(isProd, config =>
            config
                .use('postcss-loader')
                .loader(require.resolve('postcss-loader'))
                .options(postCssOptions)
        );

    webpackConfig.module
        .rule('scss')
        .test(/\.scss$/)
        .include.add(resolve('./src'))
        .end()
        .exclude.add(/node_modules/)
        .end()
        .when(
            isProd,
            config =>
                config
                    .use('mini-scss')
                    .loader(MiniCssExtractPlugin.loader)
                    .options({ publicPath: '../' }),
            config => config.use('style-loader').loader(require.resolve('style-loader'))
        )
        .use('css-loader')
        .loader(require.resolve('css-loader'))
        .options({
            modules: true,
            sourceMap: !isProd
        })
        .end()
        .when(isProd, config =>
            config
                .use('postcss-loader')
                .loader(require.resolve('postcss-loader'))
                .options(postCssOptions)
        )
        .use('sass-loader')
        .loader(require.resolve('sass-loader'));

    webpackConfig.when(isProd, config =>
        config.plugin('mini-css-extract').use(MiniCssExtractPlugin, [
            {
                filename: 'css/[name].css',
                chunkFilename: 'css/[name].css'
            }
        ])
    );
}

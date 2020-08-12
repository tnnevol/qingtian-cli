import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { resolve } from '../utils/pathUtil';
import { isProduction } from '../utils/envUtil';

const postcssPresetEnv = require('postcss-preset-env')({ browsers: 'last 2 versions', autoprefixer: { grid: true } });
const postCssOptions = {
    plugins: [postcssPresetEnv]
};
const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

export default function () {
    const {
        webpackConfig,
        projectConfig: { sassResources, filenameHashing }
    } = global;
    const isProd = isProduction();
    const disableHash = filenameHashing === false;
    const filename = `css/[name]${disableHash ? '' : '.[contenthash:8]'}.css`;

    function configSass(cssModule: boolean) {
        webpackConfig.module
            .rule(cssModule ? 'scssModule' : 'scss')
            .test(cssModule ? sassModuleRegex : sassRegex)
            .include.add(resolve('./src'))
            .end()
            .exclude.add(!cssModule ? sassModuleRegex : /node_modules/)
            .end()
            .when(
                isProd,
                config => config.use('mini-scss').loader(MiniCssExtractPlugin.loader).options({ publicPath: '../' }),
                config => config.use('style-loader').loader(require.resolve('style-loader'))
            )
            .use('css-loader')
            .loader(require.resolve('css-loader'))
            .options({
                modules: cssModule
                    ? {
                          mode: 'local',
                          localIdentName: '[path][name]__[local]--[hash:base64:5]',
                          localIdentContext: resolve('./src')
                      }
                    : false,
                sourceMap: !isProd
            })
            .end()
            .when(isProd, config =>
                config.use('postcss-loader').loader(require.resolve('postcss-loader')).options(postCssOptions)
            )
            .use('sass-loader')
            .loader(require.resolve('sass-loader'))
            .end()
            .when(!!sassResources, config =>
                config
                    .use('sass-resources-loader')
                    .loader(require.resolve('sass-resources-loader'))
                    .options({
                        resources: sassResources?.map(item => resolve(item))
                    })
            );
    }

    webpackConfig.module
        .rule('css')
        .test(cssRegex)
        .include.add(/node_modules/)
        .end()
        .when(
            isProd,
            config => config.use('mini-css').loader(MiniCssExtractPlugin.loader).options({ publicPath: '../' }),
            config => config.use('style-loader').loader(require.resolve('style-loader'))
        )
        .use('css-loader')
        .loader(require.resolve('css-loader'))
        .end()
        .when(isProd, config =>
            config.use('postcss-loader').loader(require.resolve('postcss-loader')).options(postCssOptions)
        );

    webpackConfig.module
        .rule('less')
        .test(/\.less$/)
        .include.add(/node_modules/)
        .end()
        .when(
            isProd,
            config => config.use('mini-less').loader(MiniCssExtractPlugin.loader).options({ publicPath: '../' }),
            config => config.use('style-loader').loader(require.resolve('style-loader'))
        )
        .use('css-loader')
        .loader(require.resolve('css-loader'))
        .end()
        .when(isProd, config =>
            config.use('postcss-loader').loader(require.resolve('postcss-loader')).options(postCssOptions)
        )
        .use('less-loader')
        .loader(require.resolve('less-loader'))
        .options({
            lessOptions: {
                javascriptEnabled: true
            }
        });

    configSass(false);
    configSass(true);

    webpackConfig.when(isProd, config =>
        config.plugin('mini-css-extract').use(MiniCssExtractPlugin, [
            {
                filename,
                chunkFilename: filename
            }
        ])
    );
}

import path from 'path';
import { ContextReplacementPlugin } from 'webpack';
import Config from 'webpack-chain';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { resolve } from '../utils/pathUtil';
import { isProduction } from '../utils/envUtil';

export function applyTsConfig(tsConfig: Config, isMainProcess = false) {
    const isProd = isProduction();

    tsConfig.module
        .rule('ts')
        .test(/\.tsx?$/)
        .include.add(resolve('./src'))
        .end()
        .exclude.add(/node_modules/)
        .end()
        .when(!isMainProcess && !isProd, config =>
            config
                .use('babel-loader')
                .loader(require.resolve('babel-loader'))
                .options({
                    plugins: [require.resolve('react-refresh/babel')]
                })
        )
        .use('ts-loader')
        .loader(require.resolve('ts-loader'))
        .options({
            transpileOnly: true,
            context: resolve('./'),
            getCustomTransformers: path.resolve(__dirname, '..', 'utils', 'transformers.js'),
            compilerOptions: {
                sourceMap: !isProd
            }
        });

    tsConfig.when(!isMainProcess, config => {
        if (!isProd) config.plugin('react-refresh-plugin').use(ReactRefreshPlugin);
        config.plugin('context-replacement-plugin').use(ContextReplacementPlugin, [/moment[\/\\]locale$/, /zh-cn/]);
    });
}

export default function () {
    const { webpackConfig } = global;
    applyTsConfig(webpackConfig);
}

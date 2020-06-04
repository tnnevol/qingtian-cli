import path from 'path';
import { ContextReplacementPlugin } from 'webpack';
import Config from 'webpack-chain';

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

    tsConfig.when(!isMainProcess, config =>
        config.plugin('context-replacement-plugin').use(ContextReplacementPlugin, [/moment[\/\\]locale$/, /zh-cn/])
    );
}

export default function () {
    const { webpackConfig } = global;
    applyTsConfig(webpackConfig);
}

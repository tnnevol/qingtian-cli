import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { ContextReplacementPlugin } from 'webpack';
import Config from 'webpack-chain';

import { resolve } from '../utils/pathUtil';

export function applyTsConfig(tsConfig: Config, options: ConfigOptions, isMainProcess = false) {
    const { isProd, needAnalyz } = options;

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
            getCustomTransformers: path.resolve(__dirname, '..', 'transformers.js'),
            compilerOptions: {
                sourceMap: !isProd
            }
        });

    tsConfig
        .when(!isMainProcess && isProd && needAnalyz, config =>
            config.plugin('analyzer-plugin').use(BundleAnalyzerPlugin, [
                {
                    analyzerMode: 'static',
                    generateStatsFile: true,
                    logLevel: 'error'
                }
            ])
        )
        .when(!isMainProcess, config =>
            config.plugin('context-replacement-plugin').use(ContextReplacementPlugin, [/moment[\/\\]locale$/, /zh-cn/])
        );
}

export default function (options: ConfigOptions) {
    const { webpackConfig } = global;
    applyTsConfig(webpackConfig, options);
}

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { DefinePlugin } from 'webpack';
import Config from 'webpack-chain';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WebpackBar from 'webpackbar';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

import { resolve } from '../utils/pathUtil';

export function applyBaseConfig(baseConfig: Config, options: ConfigOptions, isMainProcess = false) {
    const { projectConfig } = global;
    const needClean = isMainProcess || !projectConfig.electron;
    const { isProd } = options;
    const mainEntry = projectConfig.electron?.mainEntry || './src/main/index.ts';
    const isElectron = !!projectConfig.electron;
    const disableHash = projectConfig.filenameHashing === false;
    const outputFilename = isMainProcess
        ? '[name].js'
        : `${isProd ? 'js/' : ''}[name]${disableHash || !isProd ? '' : '.[contenthash:8]'}.js`;

    baseConfig
        .when(isMainProcess && !!mainEntry, config => config.entry('main').add(resolve(mainEntry)))
        .mode(process.env.NODE_ENV as 'none' | 'development' | 'production')
        .context(resolve('./'))
        .performance.hints(false)
        .end()
        .when(
            isProd,
            config => config.devtool(false),
            config => config.devtool('cheap-module-eval-source-map')
        )
        .when(isMainProcess, config =>
            config.target('electron-main').node.set('__dirname', false).set('__filename', false)
        )
        .cache({
            type: 'filesystem'
        })
        .output.filename(outputFilename)
        .chunkFilename(outputFilename)
        .publicPath(projectConfig.publicPath === undefined ? '/' : projectConfig.publicPath)
        .end()
        .resolve.extensions.merge(['.tsx', '.ts', '.js', '.json'])
        .end()
        .end()
        .plugin('define-plugin')
        .use(DefinePlugin, [
            {
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        ])
        .end()
        .plugin('caseSensitivePaths-plugin')
        .use(CaseSensitivePathsPlugin)
        .end()
        .plugin('progress-bar')
        .use(WebpackBar, [
            {
                name: isElectron ? (isMainProcess ? '主进程构建' : '渲染进程构建') : 'Web构建',
                color: isMainProcess ? 'yellow' : 'green'
            }
        ])
        .end()
        .when(needClean, config => config.plugin('clean-webpack-plugin').use(CleanWebpackPlugin))
        .when(!isProd, config =>
            config
                .plugin('hard-source-plugin')
                .use(HardSourceWebpackPlugin, [{ info: { level: 'warn', mode: 'test' } }])
        );
}

export default function (options: ConfigOptions) {
    const { webpackConfig } = global;
    applyBaseConfig(webpackConfig, options);
}

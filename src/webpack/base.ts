import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { DefinePlugin } from 'webpack';
import Config from 'webpack-chain';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WebpackBar from 'webpackbar';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import fs from 'fs-extra';

import { resolve } from '../utils/pathUtil';
import { NW_DEBUG_FOLDER } from '../constants';
import { isElectron, isNW, isProduction } from '../utils/envUtil';

export function applyBaseConfig(baseConfig: Config, isMainProcess = false) {
    const existsPublicFolder = fs.existsSync(resolve('public'));
    const { projectConfig } = global;
    const needClean = isMainProcess || !projectConfig.electron;
    const mainEntry = projectConfig.electron?.mainEntry || './src/main/index.ts';
    const disableHash = projectConfig.filenameHashing === false;
    const isProd = isProduction();
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
        .publicPath(projectConfig.publicPath === undefined ? (isElectron() ? '' : '/') : projectConfig.publicPath)
        .when(isNW() && !isProd, config => config.path(resolve(NW_DEBUG_FOLDER)))
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
        .plugin('progress-bar')
        .use(WebpackBar, [
            {
                name: isElectron()
                    ? isMainProcess
                        ? 'Build Main'
                        : 'Build Renderer'
                    : isNW()
                    ? 'Build NW'
                    : 'Build Web',
                color: isMainProcess ? 'yellow' : 'green'
            }
        ])
        .end()
        .when(needClean, config => config.plugin('clean-webpack-plugin').use(CleanWebpackPlugin))
        .when(
            !isProd,
            config =>
                config
                    .plugin('hard-source-plugin')
                    .use(HardSourceWebpackPlugin, [{ info: { level: 'warn', mode: 'test' } }]),
            config => config.plugin('caseSensitivePaths-plugin').use(CaseSensitivePathsPlugin)
        )
        .when(existsPublicFolder && isProd && !isMainProcess, config =>
            config.plugin('copy-plugin').use(CopyPlugin, [
                {
                    patterns: [
                        {
                            from: resolve('public')
                        }
                    ]
                }
            ])
        );
}

export default function () {
    const { webpackConfig } = global;
    applyBaseConfig(webpackConfig);
}

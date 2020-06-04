import fs from 'fs-extra';
import path from 'path';
import Config from 'webpack-chain';
import webpack from 'webpack';

import { resolve } from './pathUtil';
import { applyBaseConfig } from '../webpack/base';
import { applytsCheckerConfig } from '../webpack/ts-checker';
import { applyTsConfig } from '../webpack/ts-loader';
import { isProduction } from './envUtil';

export function getProjectConfig() {
    const configPath = resolve(`${global.cliName}.config.js`);
    if (!fs.existsSync(configPath)) return {};
    return require(configPath);
}

export async function getWebpackConfig() {
    const { webpackConfig, projectConfig } = global;
    const webpackConfigPath = path.join(__dirname, '..', 'webpack');
    const configs = fs.readdirSync(webpackConfigPath);

    for (const c of configs) {
        const { default: mergeConfig } = await import(`${webpackConfigPath}/${c}`);
        mergeConfig();
    }

    if (typeof projectConfig.chainWebpack === 'function') {
        projectConfig.chainWebpack(webpackConfig);
    }

    return webpackConfig;
}

export function getWebpackConfigOfMainProcess() {
    const webpackConfig = new Config();
    const configs = [applyBaseConfig, applyTsConfig, applytsCheckerConfig];

    configs.forEach(mergeConfig => mergeConfig(webpackConfig, true));

    return webpackConfig;
}

export function build(config: webpack.Configuration, callback?: () => void) {
    webpack(config, (err, stats) => {
        const isProd = isProduction();
        if (err) throw err;

        if (isProd) {
            process.stdout.write(
                stats.toString({
                    colors: true,
                    modules: false,
                    children: false,
                    chunks: false,
                    chunkModules: false
                }) + '\n\n'
            );
        }

        if (stats.hasErrors()) process.exit(1);

        callback && callback();
    });
}

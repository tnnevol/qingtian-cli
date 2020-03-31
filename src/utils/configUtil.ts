import fs from 'fs-extra';
import path from 'path';
import Config from 'webpack-chain';
import webpack from 'webpack';
import prettier from 'prettier';

import { resolve } from './pathUtil';
import log from './logUtil';
import { applyBaseConfig } from '../webpack/base';
import { applytsCheckerConfig } from '../webpack/ts-checker';
import { applyTsConfig } from '../webpack/ts-loader';

const prettyConfig: prettier.Options = {
    printWidth: 120,
    tabWidth: 4,
    singleQuote: true,
    semi: true,
    parser: 'json',
    endOfLine: 'lf'
};

export function printWebpackConfig(content: string) {
    const result = prettier.format(content, prettyConfig);
    console.log(result);
}

export function getProjectConfig() {
    const configPath = resolve(`${global.cliName}.config.js`);
    if (!fs.existsSync(configPath)) return {};
    return require(configPath);
}

export async function getWebpackConfig(options: ConfigOptions) {
    const { webpackConfig, projectConfig } = global;
    const webpackConfigPath = path.join(__dirname, '..', 'webpack');
    const configs = fs.readdirSync(webpackConfigPath);

    for (const c of configs) {
        const { default: mergeConfig } = await import(`${webpackConfigPath}/${c}`);
        mergeConfig(options);
    }

    if (typeof projectConfig.chainWebpack === 'function') {
        projectConfig.chainWebpack(webpackConfig);
    }

    return webpackConfig;
}

export function getWebpackConfigOfMainProcess(options: ConfigOptions) {
    const webpackConfig = new Config();
    const configs = [applyBaseConfig, applyTsConfig, applytsCheckerConfig];

    configs.forEach(mergeConfig => mergeConfig(webpackConfig, options, true));

    return webpackConfig;
}

export function build(config: webpack.Configuration, isMainProcess: boolean, callback?: () => void) {
    webpack(config, (err, stats) => {
        const isProd = process.env.NODE_ENV === 'production';
        if (err) throw err;

        if (isProd && !isMainProcess) {
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

        if (isProd && !isMainProcess) log.success('打包成功 😇\n');

        callback && callback();
    });
}

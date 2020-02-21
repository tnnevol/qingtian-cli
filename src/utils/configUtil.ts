import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';
import Config from 'webpack-chain';
import webpack from 'webpack';
import chalk from 'chalk';

import { resolve } from './pathUtil';
import { applyBaseConfig } from '../webpack/base';
import { applytsCheckerConfig } from '../webpack/ts-checker';
import { applyTsConfig } from '../webpack/ts-loader';

const prettyConfig: prettier.Options = {
    printWidth: 120,
    tabWidth: 4,
    singleQuote: true,
    semi: true,
    parser: 'babel',
    endOfLine: 'lf'
};

export function getProjectConfig() {
    const configPath = resolve('qt.config.js');
    if (!fs.existsSync(configPath)) return {};
    return require(configPath);
}

export function previewWebpackConfig(configStr: string, isMainProcess = false) {
    const result = prettier.format(`module.exports = ${configStr}`, prettyConfig);
    const name = isMainProcess ? 'main-process-preview' : 'preview';

    try {
        fs.writeFileSync(path.join(__dirname, `../../${name}.js`), result);
    } catch (error) {
        console.error(error);
    }
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

    if (options.needCheckConfig) {
        previewWebpackConfig(webpackConfig.toString());
    }

    return webpackConfig;
}

export function getWebpackConfigOfMainProcess(options: ConfigOptions) {
    const webpackConfig = new Config();
    const configs = [applyBaseConfig, applyTsConfig, applytsCheckerConfig];

    configs.forEach(mergeConfig => mergeConfig(webpackConfig, options, true));

    if (options.needCheckConfig) {
        previewWebpackConfig(webpackConfig.toString(), true);
    }

    return webpackConfig.toConfig();
}

export function build(config: webpack.Configuration, callback?: () => void) {
    webpack(config, (err, stats) => {
        if (err) throw err;

        process.stdout.write(
            stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n\n'
        );

        if (stats.hasErrors()) {
            console.log(chalk.red('😢 😢 😢 打包失败\n'));
            process.exit(1);
        }

        console.log(chalk.green('😇 打包成功\n'));
        callback && callback();
    });
}

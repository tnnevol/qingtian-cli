import { CommandModule } from 'yargs';
import fs from 'fs-extra';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { getWebpackConfig, getWebpackConfigOfMainProcess, build } from '../utils/configUtil';
import { resolve } from '../utils/pathUtil';
import { isElectron, isNW } from '../utils/envUtil';

function finalizeBuild() {
    const nwConfig = global.projectConfig.nw;
    fs.writeFileSync(resolve(`dist/package.json`), JSON.stringify(nwConfig, null, 4));
}

function noop() {}

const commandModule: CommandModule<Record<string, unknown>, { analyz: boolean }> = {
    command: 'build',
    describe: '项目打包',
    builder: {
        analyz: {
            type: 'boolean',
            alias: 'a',
            description: '开启包体分析'
        }
    },
    handler: async args => {
        process.env.NODE_ENV = 'production';

        const webpackConfig = await getWebpackConfig();

        if (args.analyz) {
            webpackConfig.plugin('analyzer-plugin').use(BundleAnalyzerPlugin, [
                {
                    analyzerMode: 'static',
                    generateStatsFile: true,
                    logLevel: 'error'
                }
            ]);
        }

        if (!isElectron()) {
            return build(webpackConfig.toConfig(), isNW() ? finalizeBuild : noop);
        }

        const mainProcessConfig = getWebpackConfigOfMainProcess();

        build(mainProcessConfig.toConfig(), () => build(webpackConfig.toConfig()));
    }
};

export const { command, describe, aliases, handler, builder } = commandModule;

import { CommandModule } from 'yargs';

import { getWebpackConfig, getWebpackConfigOfMainProcess, build, printWebpackConfig } from '../utils/configUtil';

const commandModule: CommandModule<{}, { inspect: boolean }> = {
    command: 'build',
    describe: '项目打包',
    builder: {
        analyz: {
            type: 'boolean',
            description: '是否开启包体分析'
        },
        inspect: {
            type: 'boolean',
            description: '查看webpack配置',
            default: false
        }
    },
    handler: async args => {
        process.env.NODE_ENV = 'production';

        const isElectron = !!global.projectConfig.electron;
        const webpackConfig = await getWebpackConfig({ isProd: true, needAnalyz: !!args.analyz });

        if (!isElectron) {
            if (args.inspect) return printWebpackConfig(webpackConfig.toString());
            return build(webpackConfig.toConfig());
        }

        const mainProcessConfig = getWebpackConfigOfMainProcess({
            isProd: true,
            needAnalyz: false
        });

        if (args.inspect) {
            printWebpackConfig(webpackConfig.toString() + '\n');
            printWebpackConfig(mainProcessConfig.toString());
            return;
        }

        build(mainProcessConfig.toConfig(), () => build(webpackConfig.toConfig()));
    }
};

export const { command, describe, aliases, handler, builder } = commandModule;

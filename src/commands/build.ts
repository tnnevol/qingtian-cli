import { CommandModule } from 'yargs';

import { getWebpackConfig, getWebpackConfigOfMainProcess, build } from '../utils/configUtil';

const commandModule: CommandModule = {
    command: 'build',
    describe: '打包项目',
    builder: {
        analyz: {
            type: 'boolean',
            description: '是否开启包体分析'
        },
        checkConfig: {
            type: 'boolean',
            alias: 'cc',
            description: '检查webpack配置'
        }
    },
    handler: async args => {
        process.env.NODE_ENV = 'production';

        const isElectron = !!global.projectConfig.electron;
        const webpackConfig = (
            await getWebpackConfig({ isProd: true, needAnalyz: !!args.analyz, needCheckConfig: !!args.checkConfig })
        ).toConfig();

        if (!isElectron) {
            build(webpackConfig);
            return;
        }

        const mainProcessConfig = getWebpackConfigOfMainProcess({
            isProd: true,
            needAnalyz: false,
            needCheckConfig: !!args.checkConfig
        });

        build(mainProcessConfig, () => build(webpackConfig));
    }
};

export const { command, describe, aliases, handler, builder } = commandModule;

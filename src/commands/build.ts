import { CommanderStatic } from 'commander';

import { getWebpackConfig, getWebpackConfigOfMainProcess, build, printWebpackConfig } from '../utils/configUtil';

export default function (program: CommanderStatic) {
    program
        .command('build')
        .description('项目打包')
        .option('-a --analyz', '开启包体分析')
        .option('-d --debug', '查看webpack配置')
        .action(async args => {
            process.env.NODE_ENV = 'production';

            const isElectron = !!global.projectConfig.electron;
            const webpackConfig = await getWebpackConfig({ isProd: true, needAnalyz: !!args.analyz });

            if (!isElectron) {
                if (args.debug) return printWebpackConfig(webpackConfig.toString());
                return build(webpackConfig.toConfig(), false);
            }

            const mainProcessConfig = getWebpackConfigOfMainProcess({
                isProd: true,
                needAnalyz: false
            });

            if (args.debug) {
                printWebpackConfig(webpackConfig.toString() + '\n');
                printWebpackConfig(mainProcessConfig.toString());
                return;
            }

            build(mainProcessConfig.toConfig(), true, () => build(webpackConfig.toConfig(), false));
        });
}

import { CommandModule } from 'yargs';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';

import { getWebpackConfig, printWebpackConfig, getWebpackConfigOfMainProcess } from '../utils/configUtil';
import log from '../utils/logUtil';

const commandModule: CommandModule<{}, { inspect: boolean }> = {
    command: 'dev',
    describe: '开发构建',
    builder: {
        inspect: {
            type: 'boolean',
            alias: 'i',
            description: '查看webpack配置',
            default: false
        }
    },
    handler: async args => {
        process.env.NODE_ENV = 'development';

        const isElectron = !!global.projectConfig.electron;
        const webpackConfig = await getWebpackConfig({ isProd: false, needAnalyz: false });

        if (args.inspect) {
            printWebpackConfig(webpackConfig.toString() + '\n');
            if (isElectron) {
                printWebpackConfig(getWebpackConfigOfMainProcess({ isProd: false, needAnalyz: false }).toString());
            }
            return;
        }

        const compiler = webpack(webpackConfig.toConfig());
        const devServerConfig = webpackConfig.toConfig().devServer;
        const server = new WebpackDevServer(compiler, devServerConfig);
        const port = devServerConfig?.port!;
        const info = console.info;

        compiler.hooks.done.tap('BuildStatsPlugin', () => {
            console.info = () => {
                // HACK: 清除devServer初始日志
            };
            server.listen(port, '0.0.0.0', err => {
                console.info = info;
                if (err) return console.log(err);
                log.info(`Server listening => http://localhost:${port}/ 👀`);
            });
        });
    }
};

export const { command, describe, aliases, handler, builder } = commandModule;

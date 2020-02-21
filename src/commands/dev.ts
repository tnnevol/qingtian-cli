import { CommandModule } from 'yargs';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';

import { getWebpackConfig } from '../utils/configUtil';

const commandModule: CommandModule = {
    command: 'dev',
    describe: '开发构建',
    builder: {
        checkConfig: {
            type: 'boolean',
            alias: 'cc',
            description: '检查webpack配置'
        }
    },
    handler: async args => {
        process.env.NODE_ENV = 'development';

        const webpackConfig = (
            await getWebpackConfig({ isProd: false, needAnalyz: false, needCheckConfig: !!args.checkConfig })
        ).toConfig();
        const compiler = webpack(webpackConfig);
        const devServerConfig = webpackConfig.devServer;
        const server = new WebpackDevServer(compiler, devServerConfig);
        const port = devServerConfig?.port!;

        server.listen(port, '0.0.0.0');
    }
};

export const { command, describe, aliases, handler, builder } = commandModule;

import { CommandModule } from 'yargs';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import fs from 'fs';
import { spawn } from 'child_process';
import portfinder from 'portfinder';
import { getWebpackConfig } from '../utils/configUtil';
import log from '../utils/logUtil';
import { resolve, getAssetPath } from '../utils/pathUtil';
import { isNW } from '../utils/envUtil';
import { NW_DEBUG_FOLDER, NW_DEBUG_HTML } from '../constants';

function startUpNW(port: number) {
    const nwConfig = global.projectConfig.nw!;
    const NW_DEV_ICON = 'nw_icon.png';

    if (!fs.existsSync(resolve(NW_DEBUG_FOLDER))) {
        fs.mkdirSync(resolve(NW_DEBUG_FOLDER));
    }
    if (!nwConfig.window) nwConfig.window = {};

    nwConfig.main = NW_DEBUG_HTML;
    nwConfig['node-remote'] = 'http://localhost/*';
    nwConfig.window.icon = NW_DEV_ICON;
    delete nwConfig.build;

    fs.copyFileSync(getAssetPath(NW_DEV_ICON), resolve(`${NW_DEBUG_FOLDER}/${NW_DEV_ICON}`));
    fs.writeFileSync(resolve(`${NW_DEBUG_FOLDER}/package.json`), JSON.stringify(nwConfig, null, 4));
    fs.writeFileSync(
        resolve(`${NW_DEBUG_FOLDER}/${NW_DEBUG_HTML}`),
        fs
            .readFileSync(getAssetPath(NW_DEBUG_HTML))
            .toString()
            .replace('${port}', port + '')
    );

    spawn('nw', {
        shell: true,
        env: process.env,
        stdio: 'inherit',
        cwd: resolve(NW_DEBUG_FOLDER)
    })
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));
}

const commandModule: CommandModule = {
    command: 'dev',
    describe: 'Run project',
    handler: async () => {
        process.env.NODE_ENV = 'development';

        const webpackConfig = await getWebpackConfig();
        const compiler = webpack(webpackConfig.toConfig());
        const devServerConfig = webpackConfig.toConfig().devServer;
        const server = new WebpackDevServer(compiler, devServerConfig);
        const info = console.info;
        let isHotLoad = false;
        let port = devServerConfig?.port!;

        compiler.hooks.done.tap('BuildStatsPlugin', async stats => {
            if (isHotLoad) return;
            console.info = () => {};
            portfinder.basePort = port;
            port = await portfinder.getPortPromise();

            server.listen(port, '0.0.0.0', err => {
                console.info = info;
                if (err) return console.log(err);
                isHotLoad = true;
                log.info(`Server listening => http://localhost:${port}`);
                if (isNW()) startUpNW(port);
            });
        });
    }
};

export const { command, describe, aliases, handler } = commandModule;

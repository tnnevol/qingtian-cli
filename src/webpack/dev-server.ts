import { spawn } from 'child_process';

import { getWebpackConfigOfMainProcess, build } from '../utils/configUtil';
import { resolve } from '../utils/pathUtil';

function startUpElectron() {
    spawn('node', [resolve('./node_modules/electron/cli.js'), resolve('./dist/main.js')], {
        shell: true,
        env: process.env,
        stdio: 'inherit'
    })
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));
}

export default function(options: ConfigOptions) {
    const { webpackConfig, projectConfig } = global;
    const { isProd } = options;
    const isElectron = !!projectConfig.electron;

    webpackConfig.when(!isProd, config =>
        config.devServer
            .publicPath('/')
            .contentBase(false)
            .quiet(true)
            .stats('errors-only')
            .port(4200)
            .noInfo(true)
            .inline(true)
            .compress(true)
            .hot(true)
            .overlay(true)
            .disableHostCheck(true)
            .headers({ 'Access-Control-Allow-Origin': '*' })
            .clientLogLevel('none')
            .historyApiFallback(true)
            .when(isElectron, devServer =>
                devServer.before(() => {
                    const webpackConfig = getWebpackConfigOfMainProcess(options);

                    build(webpackConfig.toConfig(), startUpElectron);
                })
            )
    );
}

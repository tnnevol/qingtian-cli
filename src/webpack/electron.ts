import { resolve } from '../utils/pathUtil';

export default function (options: ConfigOptions) {
    const { projectConfig, webpackConfig } = global;
    const entryPath = projectConfig.electron?.rendererEntry || './src/renderer/index.tsx';
    const isElectron = !!projectConfig.electron;
    const { isProd } = options;

    webpackConfig.when(isElectron, config =>
        config
            .when(!projectConfig.pages, c => c.entry('renderer').add(resolve(entryPath)))
            .target('electron-renderer')
            .node.set('__dirname', false)
            .set('__filename', false)
            .end()
            .module.rule('node')
            .test(/\.node$/)
            .use('node-loader')
            .loader(require.resolve(isProd ? 'native-ext-loader' : 'node-loader'))
            .when(isProd, loader =>
                loader.options({
                    basePath: ['..', '..', 'app.asar', 'dist']
                })
            )
    );
}

import { resolve } from '../utils/pathUtil';

export default function() {
    const { projectConfig, webpackConfig } = global;
    const entryPath = projectConfig.electron?.rendererEntry || './src/renderer/index.tsx';
    const isElectron = !!projectConfig.electron;

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
            .loader(require.resolve('node-loader'))
    );
}

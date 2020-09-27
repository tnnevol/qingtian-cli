import path from 'path';
import { resolve } from '../utils/pathUtil';
import { isElectron, isProduction } from '../utils/envUtil';

export default function () {
    const { projectConfig, webpackConfig } = global;
    const entryPath = projectConfig.electron?.rendererEntry || './src/renderer/index.tsx';

    webpackConfig.when(isElectron(), config =>
        config
            .when(!projectConfig.pages, c => c.entry('renderer').add(resolve(entryPath)))
            .target('electron-renderer')
            .node.set('__dirname', false)
            .set('__filename', false)
            .end()
            .module.rule('node')
            .test(/\.node$/)
            .use('node-loader')
            .loader(require.resolve('../loaders/native-ext-loader.js'))
            .options({
                isProduction: isProduction(),
                basePath: (resourcePath: string) => {
                    const pkgName = path.dirname(resourcePath);
                    return ['..', pkgName];
                }
            })
    );
}

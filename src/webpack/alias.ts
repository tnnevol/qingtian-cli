import { resolve } from '../utils/pathUtil';

export default function(options: ConfigOptions) {
    const { webpackConfig, projectConfig } = global;
    const { isProd } = options;
    const isElectron = !!projectConfig.electron;
    const basePath = isElectron ? './src/renderer/' : './src/';

    webpackConfig.resolve.alias
        .set('@/api', resolve(basePath + 'api'))
        .set('@/components', resolve(basePath + 'components'))
        .set('@/hooks', resolve(basePath + 'hooks'))
        .set('@/utils', resolve(basePath + 'utils'))
        .set('@/store', resolve(basePath + 'store'))
        .when(!isProd, config => config.set('react-dom', '@hot-loader/react-dom'));
}

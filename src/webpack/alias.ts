import { resolve, getBasePath } from '../utils/pathUtil';

export default function(options: ConfigOptions) {
    const { webpackConfig } = global;
    const { isProd } = options;
    const basePath = getBasePath();

    webpackConfig.resolve.alias
        .set('@/api', resolve(basePath + 'api'))
        .set('@/components', resolve(basePath + 'components'))
        .set('@/hooks', resolve(basePath + 'hooks'))
        .set('@/utils', resolve(basePath + 'utils'))
        .set('@/store', resolve(basePath + 'store'))
        .when(!isProd, config => config.set('react-dom', '@hot-loader/react-dom'));
}

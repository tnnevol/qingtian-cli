import { resolve } from '../utils/pathUtil';

export default function () {
    const {
        webpackConfig,
        projectConfig: { filenameHashing }
    } = global;
    const disableHash = filenameHashing === false;

    webpackConfig.module
        .rule('img')
        .test(/\.(gif|png|jpe?g|svg|bmp)$/)
        .include.add(resolve('./src'))
        .end()
        .exclude.add(/node_modules/)
        .end()
        .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options({
            limit: 4096,
            name: `img/[name]${disableHash ? '' : '.[hash:8]'}.[ext]`
        });

    webpackConfig.module
        .rule('font')
        .test(/\.(woff|woff2|eot|ttf|otf)$/)
        .include.add(resolve('./src'))
        .end()
        .exclude.add(/node_modules/)
        .end()
        .use('file-loader')
        .loader(require.resolve('file-loader'))
        .options({
            name: `font/[name]${disableHash ? '' : '.[hash:8]'}.[ext]`
        });
}

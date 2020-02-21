import { resolve } from '../utils/pathUtil';

export default function() {
    const { webpackConfig } = global;

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
            limit: 10000,
            name: 'img/[hash:8].[name].[ext]'
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
            name: 'font/[hash:8].[name].[ext]'
        });
}

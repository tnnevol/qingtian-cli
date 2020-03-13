import HtmlWebpackPlugin from 'html-webpack-plugin';

import { resolve } from '../utils/pathUtil';

export default function() {
    const {
        webpackConfig,
        projectConfig: { pages }
    } = global;

    if (!!pages) {
        for (const key in pages) {
            if (pages.hasOwnProperty(key)) {
                const page = pages[key];
                const entry = page.entry!;
                const name = key;
                const template = page.template || 'public/index.html';
                const filename = page.filename || 'index.html';
                const title = page.title || 'Webpack App';

                webpackConfig
                    .entry(name)
                    .add(resolve(entry))
                    .end()
                    .plugin(`${name}-html`)
                    .use(HtmlWebpackPlugin, [
                        {
                            inject: 'body',
                            template: resolve(template),
                            chunks: ['chunk-vendors', 'chunk-common', name],
                            filename,
                            title
                        }
                    ]);
            }
        }
        return;
    }

    webpackConfig.plugin('html').use(HtmlWebpackPlugin, [
        {
            inject: 'body',
            template: resolve('public/index.html'),
            favicon: resolve('public/favicon.ico')
        }
    ]);
}

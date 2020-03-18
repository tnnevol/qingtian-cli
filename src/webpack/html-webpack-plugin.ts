import HtmlWebpackPlugin from 'html-webpack-plugin';

import { resolve } from '../utils/pathUtil';

const defaultHtmlConfig = {
    template: 'public/index.html',
    filename: 'index.html',
    title: 'Webpack App',
    favicon: 'public/favicon.ico'
};

export default function() {
    const {
        webpackConfig,
        projectConfig: { pages, title, favicon, filename, template }
    } = global;

    if (!!pages) {
        for (const key in pages) {
            if (pages.hasOwnProperty(key)) {
                const page = pages[key];
                const entry = page.entry!;
                const name = key;
                const template = page.template || defaultHtmlConfig.template;
                const filename = page.filename || defaultHtmlConfig.filename;
                const title = page.title || defaultHtmlConfig.title;
                const favicon = page.favicon || defaultHtmlConfig.favicon;

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
                            title,
                            favicon: resolve(favicon)
                        }
                    ]);
            }
        }
        return;
    }

    webpackConfig.plugin('html').use(HtmlWebpackPlugin, [
        {
            inject: 'body',
            template: resolve(template || defaultHtmlConfig.template),
            favicon: resolve(favicon || defaultHtmlConfig.favicon),
            title: title || defaultHtmlConfig.title,
            filename: filename || defaultHtmlConfig.filename
        }
    ]);
}

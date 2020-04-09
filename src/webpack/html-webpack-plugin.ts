import HtmlWebpackPlugin from 'html-webpack-plugin';
import Config from 'webpack-chain';

import { resolve } from '../utils/pathUtil';
import InlineChunkHtmlPlugin from '../utils/InlineChunkHtmlPlugin';

const defaultHtmlConfig = {
    template: 'public/index.html',
    filename: 'index.html',
    title: 'Webpack App',
    favicon: 'public/favicon.ico'
};

function inlineRuntime(config: Config) {
    config.when(process.env.NODE_ENV === 'production', c =>
        c.plugin('inline-runtime').use(InlineChunkHtmlPlugin, [HtmlWebpackPlugin, [/runtime/]])
    );
}

export default function () {
    const {
        webpackConfig,
        projectConfig: { pages, title, favicon, filename, template }
    } = global;

    // TODO: 多页面打包待测试
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

        return inlineRuntime(webpackConfig);
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

    inlineRuntime(webpackConfig);
}

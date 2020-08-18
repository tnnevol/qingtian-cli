import HtmlWebpackPlugin from 'html-webpack-plugin';
import Config from 'webpack-chain';
import { resolve, getAssetPath } from '../utils/pathUtil';
import InlineChunkHtmlPlugin from '../plugins/InlineChunkHtmlPlugin';
import { isProduction, isNotWebApp } from '../utils/envUtil';

function inlineRuntime(config: Config) {
    config.when(isProduction(), c =>
        c.plugin('inline-runtime').use(InlineChunkHtmlPlugin, [HtmlWebpackPlugin, [/runtime/]])
    );
}

function getTitle(title: string | undefined) {
    if (isNotWebApp()) return undefined;
    return title || 'React App';
}

function getFavicon(favicon: string | undefined) {
    if (isNotWebApp()) return undefined;
    return favicon ? resolve(favicon) : getAssetPath('favicon.ico');
}

function getTemplate(template: string | undefined) {
    return template ? resolve(template) : getAssetPath('index.html');
}

function getFilename(filename: string | undefined) {
    return filename || 'index.html';
}

export default function () {
    const {
        webpackConfig,
        projectConfig: { pages, title, favicon, filename, template }
    } = global;

    if (!!pages) {
        for (const key in pages) {
            if (pages.hasOwnProperty(key)) {
                const page = pages[key];

                webpackConfig
                    .entry(key)
                    .add(resolve(page.entry!))
                    .end()
                    .plugin(`${key}-html`)
                    .use(HtmlWebpackPlugin, [
                        {
                            inject: 'body',
                            chunks: ['chunk-vendors', 'chunk-common', key],
                            filename: getFilename(page.filename),
                            title: getTitle(page.title),
                            favicon: getFavicon(page.favicon),
                            template: getTemplate(page.template)
                        }
                    ]);
            }
        }

        return inlineRuntime(webpackConfig);
    }

    webpackConfig.plugin('html').use(HtmlWebpackPlugin, [
        {
            inject: 'body',
            filename: getFilename(filename),
            title: getTitle(title),
            favicon: getFavicon(favicon),
            template: getTemplate(template)
        }
    ]);

    inlineRuntime(webpackConfig);
}

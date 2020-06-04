import HtmlWebpackPlugin, { HtmlTagObject } from 'html-webpack-plugin';
import { Compiler } from 'webpack';

class InlineChunkHtmlPlugin {
    htmlWebpackPlugin: typeof HtmlWebpackPlugin;
    tests: RegExp[];
    constructor(htmlWebpackPlugin: typeof HtmlWebpackPlugin, tests: RegExp[]) {
        this.htmlWebpackPlugin = htmlWebpackPlugin;
        this.tests = tests;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getInlinedTag(publicPath: string, assets: any, tag: HtmlTagObject) {
        const src = tag.attributes.src as string;
        if (tag.tagName !== 'script' || !(tag.attributes && src)) {
            return tag;
        }
        const scriptName = publicPath ? src.replace(publicPath, '') : src;
        if (!this.tests.some(test => scriptName.match(test))) {
            return tag;
        }
        const asset = assets[scriptName];
        if (asset == null) {
            return tag;
        }
        return { tagName: 'script', innerHTML: asset.source(), closeTag: true };
    }

    apply(compiler: Compiler) {
        let publicPath = compiler.options.output?.publicPath || '';
        if (publicPath && !publicPath.endsWith('/')) {
            publicPath += '/';
        }

        compiler.hooks.compilation.tap('InlineChunkHtmlPlugin', compilation => {
            const tagFunction = (tag: HtmlTagObject) => this.getInlinedTag(publicPath, compilation.assets, tag);
            const hooks = this.htmlWebpackPlugin.getHooks(compilation);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            hooks.alterAssetTagGroups.tap('InlineChunkHtmlPlugin', (assets: any) => {
                assets.headTags = assets.headTags.map(tagFunction);
                assets.bodyTags = assets.bodyTags.map(tagFunction);
                return assets;
            });
        });
    }
}

export default InlineChunkHtmlPlugin;

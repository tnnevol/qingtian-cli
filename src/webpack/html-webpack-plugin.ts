import HtmlWebpackPlugin from 'html-webpack-plugin';

import { resolve } from '../utils/pathUtil';

export default function() {
    const { webpackConfig } = global;

    webpackConfig.plugin('html').use(HtmlWebpackPlugin, [
        {
            inject: 'body',
            template: resolve('public/index.html')
        }
    ]);
}

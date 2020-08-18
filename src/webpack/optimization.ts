import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { isProduction } from '../utils/envUtil';

export default function () {
    const { webpackConfig } = global;

    if (!isProduction()) return;

    webpackConfig.optimization
        .runtimeChunk({ name: 'runtime' })
        .splitChunks({
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 3,
            maxInitialRequests: 3,
            cacheGroups: {
                common: {
                    name: 'chunk-common',
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                },
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -15,
                    chunks: 'initial',
                    reuseExistingChunk: true
                },
                antd: {
                    name: 'chunk-antd',
                    chunks: 'initial',
                    test: /[\\/]node_modules[\\/](antd|@ant-design)/,
                    priority: -10,
                    reuseExistingChunk: true
                }
            }
        })
        .minimize(true)
        .minimizer('min-css')
        .use(OptimizeCSSAssetsPlugin, [
            {
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }]
                }
            }
        ])
        .end()
        .minimizer('min-js')
        .use(TerserPlugin, [
            {
                parallel: true,
                extractComments: false,
                terserOptions: {
                    output: {
                        comments: false
                    },
                    compress: {
                        drop_console: true
                    }
                }
            }
        ]);
}

import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

export default function(options: ConfigOptions) {
    const { webpackConfig } = global;
    const { isProd } = options;

    if (!isProd) return;

    webpackConfig.optimization
        .splitChunks({
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 3,
            maxInitialRequests: 3,
            cacheGroups: {
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'initial'
                },
                common: {
                    name: 'chunk-common',
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }
        })
        .minimizer('min-css')
        .use(OptimizeCSSAssetsPlugin, [
            {
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }]
                }
            }
        ]);
}

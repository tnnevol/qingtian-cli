import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import Config from 'webpack-chain';

export function applytsCheckerConfig(checkerConfig: Config, options: ConfigOptions) {
    const { isProd } = options;

    checkerConfig.plugin('ts-checker-plugin').use(ForkTsCheckerWebpackPlugin, [
        {
            async: !isProd,
            logger: {
                error(error) {
                    console.log(error);
                },
                warn(warn) {
                    console.warn(warn);
                },
                info() {
                    // HACK: 隐藏冗余信息
                }
            }
        }
    ]);
}

export default function (options: ConfigOptions) {
    const { webpackConfig } = global;

    applytsCheckerConfig(webpackConfig, options);
}

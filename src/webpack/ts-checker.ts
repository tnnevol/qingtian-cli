import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import Config from 'webpack-chain';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function applytsCheckerConfig(checkerConfig: Config, options: ConfigOptions) {
    checkerConfig.plugin('ts-checker-plugin').use(ForkTsCheckerWebpackPlugin, [
        {
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
            },
            measureCompilationTime: false
        }
    ]);
}

export default function (options: ConfigOptions) {
    const { webpackConfig } = global;

    applytsCheckerConfig(webpackConfig, options);
}

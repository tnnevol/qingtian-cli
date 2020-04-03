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
                warn() {
                    // HACK: 隐藏冗余信息
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

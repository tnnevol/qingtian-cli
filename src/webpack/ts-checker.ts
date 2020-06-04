import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import Config from 'webpack-chain';

export function applytsCheckerConfig(checkerConfig: Config) {
    checkerConfig.plugin('ts-checker-plugin').use(ForkTsCheckerWebpackPlugin, [
        {
            logger: {
                error(error) {
                    console.log(error);
                },
                warn() {},
                info() {}
            }
        }
    ]);
}

export default function () {
    const { webpackConfig } = global;

    applytsCheckerConfig(webpackConfig);
}

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import Config from 'webpack-chain';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function applytsCheckerConfig(checkerConfig: Config, options: ConfigOptions, isMainProcess = false) {
    const { isProd } = options;

    checkerConfig.plugin('ts-checker-plugin').use(ForkTsCheckerWebpackPlugin, [
        {
            async: !isProd
        }
    ]);
}

export default function(options: ConfigOptions) {
    const { webpackConfig } = global;

    applytsCheckerConfig(webpackConfig, options);
}

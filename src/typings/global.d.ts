// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Config from 'webpack-chain';

declare global {
    namespace NodeJS {
        interface Global {
            webpackConfig: Config;
            projectConfig: {
                electron?: {
                    rendererEntry?: string;
                    mainEntry?: string;
                };
                chainWebpack?: (config: Config) => void;
            };
        }
        interface ProcessEnv {
            NODE_ENV: 'none' | 'development' | 'production';
        }
    }

    interface ConfigOptions {
        isProd: boolean;
        needAnalyz: boolean;
        needCheckConfig: boolean;
    }
}

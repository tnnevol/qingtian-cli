// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Config from 'webpack-chain';

declare global {
    namespace NodeJS {
        interface Global {
            cliName: string;
            webpackConfig: Config;
            projectConfig: {
                electron?: {
                    rendererEntry?: string;
                    mainEntry?: string;
                };
                chainWebpack?: (config: Config) => void;
                pages: Record<
                    string,
                    {
                        entry?: string;
                        template?: string;
                        filename?: string;
                        title?: string;
                    }
                >;
                sassResources?: string[];
            };
        }
        interface ProcessEnv {
            NODE_ENV: 'none' | 'development' | 'production';
        }
    }

    interface ConfigOptions {
        isProd: boolean;
        needAnalyz: boolean;
    }
}

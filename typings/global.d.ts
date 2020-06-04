import Config from 'webpack-chain';

declare global {
    namespace NodeJS {
        interface Global {
            cliName: string;
            webpackConfig: Config;
            projectConfig: {
                // 如果是 electron 项目则必须要有该字段，例如：electron: {}
                electron?: {
                    // 配置 electron 项目渲染进程入口文件路径
                    rendererEntry?: string;
                    // 配置 electron 项目主进程入口文件路径
                    mainEntry?: string;
                };
                nw?: {};
                // webpack 配置拓展
                chainWebpack?: (config: Config) => void;
                // 多页面打包配置
                pages?: Record<
                    string,
                    {
                        entry?: string;
                        template?: string;
                        filename?: string;
                        title?: string;
                        favicon?: string;
                    }
                >;
                // sass 变量注入，供 sass-resources-loader 使用
                sassResources?: string[];
                // 配置 html 模板路径，默认路径为 public/index.html
                template?: string;
                // 配置生成的 html 文件名称，默认名称为 index.html
                filename?: string;
                // 配置 html 页面标题，如设置此项，html 模板文件的 title 标签需替换为：<title><%= htmlWebpackPlugin.options.title %></title>
                title?: string;
                // 配置 favicon 路径，默认路径为 public/favicon.ico
                favicon?: string;
                // 生成的静态资源是否加hash以控制缓存
                filenameHashing?: boolean;
                publicPath?: string;
            };
        }
    }
}

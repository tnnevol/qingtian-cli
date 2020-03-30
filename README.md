# qingtian-cli

> 一个专注于 react + typescript + electron 开发的工作流

# Install

```
yarn global add qingtian-cli
```

or

```
npm install qingtian-cli -g
```

# Contains

-   web 以及 electron 项目初始化 ✅
-   常用代码生成 ✅
-   一键进入 webpack 开发模式和打包模式 ✅
-   内置 typescript 支持 ✅
-   内置 sass 支持 ✅
-   内置 postcss 支持 ✅
-   webpack 打包分析 ✅
-   css modules ✅
-   支持多页应用构建 ✅

# Commands

-   **qt new**： 创建 web 或 electron 项目
-   **qt dev**： 启动项目开发
-   **qt build**： 生产环境构建
-   **qt generate**： 常用代码生成

# Config

新建一个 `qt.config.js` 置于项目根目录，内容如下

```js
module.exports = {
    electron: {
        rendererEntry: './src/renderer/index.tsx', // 配置渲染进程入口
        mainEntry: './src/main/index.ts', // 配置主进程入口
    },
    template: 'public/index.html',
    filename: 'index.html',
    title: 'Webpack App',
    favicon: 'public/favicon.ico',
    sassResources: ['./src/renderer/sass/vars.scss', './src/renderer/sass/mixins.scss'], // sass工具注入
    pages: {
        // 多页面配置
        index: {
            entry: 'xxx',
            template: 'xxx',
            filename: 'xxx',
            title: 'xxx',
            favicon: 'xxxxx',
        },
        app: {
            entry: 'xxx',
            template: 'xxx',
            filename: 'xxx',
            title: 'xxx',
            favicon: 'xxxxx',
        },
    },
    // webpack配置扩展
    chainWebpack: (config) => {},
};
```

module.exports = {
    electron: {
        rendererEntry: './src/renderer/index.tsx', // 配置渲染进程入口
        mainEntry: './src/main/index.ts' // 配置主进程入口
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
            favicon: 'xxxxx'
        },
        app: {
            entry: 'xxx',
            template: 'xxx',
            filename: 'xxx',
            title: 'xxx',
            favicon: 'xxxxx'
        }
    },
    // webpack配置扩展
    chainWebpack: config => {}
};

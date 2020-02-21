// eslint-disable-next-line @typescript-eslint/no-var-requires
const transformerFactory = require('ts-import-plugin');

module.exports = () => ({
    before: [
        transformerFactory([
            {
                libraryName: 'antd',
                style: 'css'
            },
            {
                style: false,
                libraryName: 'lodash',
                libraryDirectory: null,
                camel2DashComponentName: false
            }
        ])
    ]
});

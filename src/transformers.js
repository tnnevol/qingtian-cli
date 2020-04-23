const transformerFactory = require('ts-import-plugin');

module.exports = () => ({
    before: [
        transformerFactory([
            {
                libraryName: 'antd',
                style: true
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

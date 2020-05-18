const transformerFactory = require('ts-import-plugin');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;

const styledComponentsTransformer = createStyledComponentsTransformer({
    getDisplayName(filename, bindingName) {
        return bindingName || filename;
    }
});

module.exports = () => ({
    before: [
        styledComponentsTransformer,
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

import { resolve } from '../utils/pathUtil';
import { getProjectAlias } from '../utils/configUtil';

const projectTsConfig = require(resolve('tsconfig.json'));

export default function (options: ConfigOptions) {
    const { webpackConfig } = global;
    const { isProd } = options;
    const alias = getProjectAlias(projectTsConfig);

    for (const key in alias) {
        if (alias.hasOwnProperty(key)) {
            webpackConfig.resolve.alias.set(key, alias[key]);
        }
    }

    webpackConfig.resolve.alias.when(!isProd, config => config.set('react-dom', '@hot-loader/react-dom'));
}

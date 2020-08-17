import path from 'path';

import { resolve } from '../utils/pathUtil';
import { isProduction } from '../utils/envUtil';

const projectTsConfig = require(resolve('tsconfig.json'));

type TsconfigFile = {
    compilerOptions: {
        baseUrl: string;
        paths: {
            [aliasName: string]: string[];
        };
    };
};

type WebpackAliases = {
    [aliasName: string]: string;
};

const replaceGlobs = (path: string): string => path.replace(/(\/\*\*)*\/\*$/, '');

export function getProjectAlias(tsconfigFile: TsconfigFile, dirname = '.'): WebpackAliases {
    const { baseUrl, paths } = tsconfigFile.compilerOptions;
    if (!paths) return {};
    return Object.keys(paths).reduce((aliases: WebpackAliases, pathName) => {
        const alias = replaceGlobs(pathName);
        const p = replaceGlobs(paths[pathName][0]);
        aliases[alias] = path.resolve(dirname, baseUrl, p);
        return aliases;
    }, {});
}

export default function () {
    const { webpackConfig } = global;
    const alias = getProjectAlias(projectTsConfig);

    for (const key in alias) {
        if (alias.hasOwnProperty(key)) {
            webpackConfig.resolve.alias.set(key, alias[key]);
        }
    }

    webpackConfig.resolve.alias.when(!isProduction(), config =>
        config.set('react-refresh/runtime', require.resolve('react-refresh/runtime'))
    );
}

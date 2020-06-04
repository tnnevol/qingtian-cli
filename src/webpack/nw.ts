import { isNW } from '../utils/envUtil';

export default function () {
    const { webpackConfig } = global;

    webpackConfig.when(isNW(), config => config.target('node-webkit'));
}

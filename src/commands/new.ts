import fs from 'fs-extra';
import ora from 'ora';
import shell from 'shelljs';
import { CommanderStatic } from 'commander';

import log from '../utils/logUtil';
import { resolve } from '../utils/pathUtil';

const download = require('download-git-repo');
const downloadAddressMap: Record<string, string> = {
    web: 'github:xieqingtian/web-boilerplate',
    electron: 'github:xieqingtian/electron-boilerplate'
};
const spinner = ora('正在下载项目模版...\n');

export default function (program: CommanderStatic) {
    program
        .command('new <name>')
        .description('项目创建')
        .requiredOption('-t --type <web|electron>', '项目类型', 'web')
        .option('-si --skip-install', '是否跳过安装依赖包')
        .option('-sg --skip-git', '是否跳过初始化git仓库')
        .action((name: string, args) => {
            const projectType = args.type;
            const projectName = name;
            const projectPath = resolve(projectName);

            if (fs.existsSync(projectPath)) {
                return log.error('该项目已存在');
            }

            spinner.start();
            download(downloadAddressMap[projectType], projectPath, (err: Error) => {
                spinner.stop();
                if (err) {
                    return log.error(`创建项目失败：${err.message} 😢`);
                }
                if (!args['skipGit']) shell.exec(`cd ${projectName} && git init`);
                if (!args['skipInstall']) shell.exec(`cd ${projectName} && yarn install`);
                log.success(`创建项目成功：${projectPath} 😇`);
            });
        });
}

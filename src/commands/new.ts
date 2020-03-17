import { CommandModule } from 'yargs';
import fs from 'fs-extra';
import ora from 'ora';
import shell from 'shelljs';

import log from '../utils/logUtil';
import { resolve } from '../utils/pathUtil';

const download = require('download-git-repo');
const downloadAddressMap: Record<string, string> = {
    web: 'github:xieqingtian/web-boilerplate',
    electron: 'github:xieqingtian/electron-boilerplate'
};
const spinner = ora('正在下载项目模版...\n');

const commandModule: CommandModule<{}, { name: string; type: string; 'skip-install': boolean; 'skip-git': boolean }> = {
    command: 'new <name>',
    aliases: 'n <name>',
    describe: '项目创建',
    builder: yargs => {
        return yargs
            .positional('name', {
                demandOption: true,
                description: '项目名称',
                type: 'string'
            })
            .option('type', {
                type: 'string',
                alias: 't',
                description: '项目类型',
                choices: Object.keys(downloadAddressMap),
                default: 'web',
                demandOption: false
            })
            .option('skip-install', {
                type: 'boolean',
                alias: 'si',
                description: '是否跳过安装依赖包',
                default: false
            })
            .option('skip-git', {
                type: 'boolean',
                alias: 'sg',
                description: '是否跳过初始化git仓库',
                default: false
            });
    },
    handler: args => {
        const projectType = args.type;
        const projectName = args.name;
        const projectPath = resolve(projectName);

        if (fs.existsSync(projectPath)) {
            return log.error('该项目已存在', true);
        }

        spinner.start();
        download(downloadAddressMap[projectType], projectPath, (err: Error) => {
            spinner.stop();
            if (err) {
                console.log(err);
                return log.error('创建项目失败 😢');
            }
            if (!args['skip-git']) shell.exec(`cd ${projectName} && git init`);
            if (!args['skip-install']) shell.exec(`cd ${projectName} && yarn install`);
            log.success('创建项目成功 😇');
        });
    }
};

export const { command, describe, aliases, handler, builder } = commandModule;

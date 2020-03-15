import { CommandModule } from 'yargs';
import fs from 'fs-extra';
import ora from 'ora';
import shell from 'shelljs';

import log from '../utils/logUtil';
import { resolve } from '../utils/pathUtil';

const download = require('download-git-repo');
const downloadAddressMap: Record<string, string> = {
    web: 'github:xieqingtian/web-boilerplate',
    electron: ''
};
const spinner = ora('正在下载项目模版...');

const commandModule: CommandModule<{}, { type: string; 'skip-install': boolean; 'skip-git': boolean }> = {
    command: 'new',
    describe: `项目创建: ${global.cliName} new <projectName> --type [projectType]`,
    builder: {
        type: {
            type: 'string',
            alias: 't',
            description: '项目类型',
            choices: Object.keys(downloadAddressMap),
            default: 'web'
        },
        'skip-install': {
            type: 'boolean',
            alias: 'si',
            description: '是否跳过安装依赖包',
            default: false
        },
        'skip-git': {
            type: 'boolean',
            alias: 'sg',
            description: '是否跳过初始化git仓库',
            default: false
        }
    },
    handler: args => {
        if (args._.length !== 2) {
            return log.error('项目名称格式错误', true);
        }

        const projectType = args.type;
        const projectName = args._.pop() as string;
        const projectPath = resolve(projectName);

        if (fs.existsSync(projectPath)) {
            return log.error('该项目已存在', true);
        }

        spinner.start();
        download(downloadAddressMap[projectType], projectPath, (err: any) => {
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

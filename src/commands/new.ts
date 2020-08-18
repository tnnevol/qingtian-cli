import { CommandModule } from 'yargs';
import fs from 'fs';
import ora from 'ora';
import shell from 'shelljs';
import log from '../utils/logUtil';
import { resolve } from '../utils/pathUtil';

const download = require('download-git-repo');
const downloadAddressMap: Record<string, string> = {
    web: 'github:xieqingtian/web-boilerplate',
    electron: 'github:xieqingtian/electron-boilerplate'
};
const spinner = ora('Downloading project boilerplate...\n');

const commandModule: CommandModule<{}, { name: string; type: string; 'skip-install': boolean; 'skip-git': boolean }> = {
    command: 'new <name>',
    describe: 'Initialize project',
    builder: yargs => {
        return yargs
            .positional('name', {
                demandOption: true,
                description: 'Project name',
                type: 'string'
            })
            .option('type', {
                type: 'string',
                alias: 't',
                description: 'Project type',
                choices: Object.keys(downloadAddressMap),
                default: 'web',
                demandOption: false
            })
            .option('skip-install', {
                type: 'boolean',
                alias: 'si',
                description: 'Skip to install dependencies',
                default: false
            })
            .option('skip-git', {
                type: 'boolean',
                alias: 'sg',
                description: 'Skip initializing the git repository',
                default: false
            });
    },
    handler: args => {
        const projectType = args.type;
        const projectName = args.name;
        const projectPath = resolve(projectName);

        if (fs.existsSync(projectPath)) return log.error('The project already exists');

        spinner.start();
        download(downloadAddressMap[projectType], projectPath, (err: Error) => {
            spinner.stop();
            if (err) return log.error(`Failed to create project: ${err.message}`);
            if (!args['skip-git']) shell.exec(`cd ${projectName} && git init`);
            if (!args['skip-install']) shell.exec(`cd ${projectName} && yarn install`);
            log.success(`Successfully created the project: ${projectPath}`);
        });
    }
};

export const { command, describe, aliases, handler, builder } = commandModule;

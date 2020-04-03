import fs from 'fs-extra';
import { join, parse, resolve } from 'path';
import Handlebars from 'handlebars';
import inquirer from 'inquirer';

import log from './logUtil';
import { getBasePath } from './pathUtil';

export type FileType = 'hooks' | 'slice' | 'component';

function firstUpperCase(str: string) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

function generator(fileType: FileType, destPath: string) {
    if (fs.existsSync(destPath)) return log.error(`${fileType} 创建失败：该文件已存在 😢\n`);

    const { name } = parse(destPath);
    const file = `${fileType}.ts${fileType === 'component' ? 'x' : ''}`;

    try {
        const fileContents = Buffer.from(
            Handlebars.compile(fs.readFileSync(join(__dirname, `../../templates/${file}`)).toString())({ name })
        );

        if (fileType !== 'component') {
            fs.writeFileSync(destPath, fileContents);
        } else {
            fs.mkdirSync(destPath);
            fs.writeFileSync(join(destPath, 'index.tsx'), fileContents);
            fs.writeFileSync(join(destPath, 'index.module.scss'), '');
        }

        log.success(`${fileType} 创建成功：${destPath} 😇\n`);
    } catch (error) {
        log.error(`${fileType} 创建失败：${error.message} 😢\n`);
    }
}

export function createFile(type: FileType, name: string, path = '') {
    const dirPath = join(process.cwd(), getBasePath(), type === 'slice' ? 'store' : type);
    const ext = type === 'component' ? '' : '.ts';
    let fileName = '';

    switch (type) {
        case 'component':
            fileName = firstUpperCase(name);
            break;
        case 'hooks':
            fileName =
                name.slice(0, 3) !== 'use' ? 'use' + firstUpperCase(name) : 'use' + firstUpperCase(name.slice(3));
            break;
        case 'slice':
            fileName = ['slice', 'Slice'].includes(name.slice(-5)) ? name.slice(0, -5) + 'Slice' : name + 'Slice';
            break;
        default:
            break;
    }

    const filePath = path
        ? join(process.cwd(), path, fileName + ext)
        : fs.existsSync(dirPath)
        ? join(dirPath, fileName + ext)
        : join(process.cwd(), fileName + ext);

    generator(type, filePath);
}

function configTemplate(content: string) {
    return `// eslint-disable-next-line spaced-comment
    /// <reference path="${resolve(__dirname, '..', '..', 'typings', 'global.d.ts')}" />

    const projectConfig: NodeJS.Global['projectConfig'] = ${content};

    module.exports = projectConfig;`;
}

export function correctProjectConfig(projectPath: string) {
    let configPath = '';
    let isJsFile = false;
    const tsConfigPath = join(projectPath, `${global.cliName}.config.ts`);
    const jsConfigPath = join(projectPath, `${global.cliName}.config.js`);

    switch (true) {
        case fs.existsSync(tsConfigPath):
            configPath = tsConfigPath;
            break;
        case fs.existsSync(jsConfigPath):
            configPath = jsConfigPath;
            isJsFile = true;
            break;
        default:
            break;
    }

    if (configPath) {
        try {
            const config = require(configPath);
            const data = configTemplate(JSON.stringify(config));

            fs.writeFileSync(configPath, data);
            if (isJsFile) fs.renameSync(jsConfigPath, tsConfigPath);
        } catch (error) {
            console.log(error);
        }
        return;
    }

    const webDefaultConfig = {
        sassResources: ['src/sass/vars.scss', 'src/sass/mixins.scss']
    };

    const electronDefaultConfig = {
        electron: {},
        sassResources: ['src/renderer/sass/vars.scss', 'src/renderer/sass/mixins.scss']
    };

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'value',
                message: '未发现项目配置文件，是否需要生成默认配置文件？',
                choices: [
                    {
                        name: '生成web项目配置',
                        value: 0
                    },
                    {
                        name: '生成electron项目配置',
                        value: 1
                    },
                    {
                        name: '不生成配置',
                        value: 2
                    }
                ]
            }
        ])
        .then(answer => {
            if (answer.value === 2) return;
            try {
                fs.writeFileSync(
                    tsConfigPath,
                    configTemplate(JSON.stringify(answer.value === 0 ? webDefaultConfig : electronDefaultConfig))
                );
                log.success('配置生成成功 😇\n');
            } catch (error) {
                console.log(error);
            }
        });
}

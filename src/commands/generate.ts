import { CommanderStatic } from 'commander';
import fs from 'fs-extra';
import { join, parse } from 'path';
import Handlebars from 'handlebars';

import log from '../utils/logUtil';
import { getBasePath } from '..//utils/pathUtil';

type FileType = 'hooks' | 'slice' | 'compo';

function firstUpperCase(str: string) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

function generator(fileType: FileType, destPath: string) {
    if (fs.existsSync(destPath)) return log.error(`${fileType} 创建失败：该文件已存在 😢\n`);

    const { name } = parse(destPath);
    const file = `${fileType}.ts${fileType === 'compo' ? 'x' : ''}`;

    try {
        const fileContents = Buffer.from(
            Handlebars.compile(fs.readFileSync(join(__dirname, `../../templates/${file}`)).toString())({ name })
        );

        if (fileType !== 'compo') {
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

function createFile(type: FileType, name: string, path = '') {
    const dirPath = join(process.cwd(), getBasePath(), type === 'slice' ? 'store' : type);
    const ext = type === 'compo' ? '' : '.ts';
    let fileName = '';

    switch (type) {
        case 'compo':
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

export default function (program: CommanderStatic) {
    program
        .command('generate <type> <name> [path]')
        .alias('g')
        .description('代码生成')
        .action((type: FileType, name: string, path: string | undefined) => {
            if (!['hooks', 'slice', 'compo'].includes(type)) return;
            createFile(type, name, path || '');
        });
}

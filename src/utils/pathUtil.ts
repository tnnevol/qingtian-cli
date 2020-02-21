import path from 'path';

export function resolve(p: string) {
    return path.join(process.cwd(), p);
}

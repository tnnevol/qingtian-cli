const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (exists && isDirectory) {
        const dest_exists = fs.existsSync(dest);
        if (!dest_exists) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

function getAssetsPath(dir) {
    return path.join(__dirname, '..', dir, 'assets');
}

copyRecursiveSync(getAssetsPath('src'), getAssetsPath('lib'));

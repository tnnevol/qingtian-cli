/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs-extra');
const path = require('path');

function getPath(dir) {
    return path.join(__dirname, '..', `${dir}/transformers.js`);
}

fs.copyFileSync(getPath('src'), getPath('lib'));

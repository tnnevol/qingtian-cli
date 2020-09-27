const path = require('path');

module.exports = function (content) {
    const defaultConfig = {
        basePath: () => [],
        emit: false,
        isProduction: false
    };

    const config = Object.assign(defaultConfig, this.query);
    const fileName = path.basename(this.resourcePath);

    if (config.emit) {
        if (this.emitFile) {
            this.emitFile(fileName, content, false);
        } else {
            throw new Error('emitFile function is not available');
        }
    }

    this.addDependency(this.resourcePath);

    if (!config.isProduction) {
        const filePath = JSON.stringify(this.resourcePath);
        return (
            'try { global.process.dlopen(module, ' +
            filePath +
            '); } ' +
            "catch(exception) { throw new Error('Cannot open ' + " +
            filePath +
            " + ': ' + exception); };"
        );
    }

    const filePathArray = config.basePath(this.resourcePath).concat(fileName);
    const filePath = JSON.stringify(filePathArray).slice(1, -1);

    return (
        "const path = require('path');" +
        'const filePath = path.resolve(__dirname, ' +
        filePath +
        ');' +
        'try { global.process.dlopen(module, filePath); } ' +
        "catch(exception) { throw new Error('Cannot open ' + filePath + ': ' + exception); };"
    );
};

module.exports.raw = true;

const { readdirSync } = require('fs');
const { resolve: pathResolve } = require('path');

const exportDirFiles = (dir = __dirname) => {
    const files = {};
    readdirSync(pathResolve(dir, './')).forEach(file => {
        if (file.match(/\.js$/) !== null && file !== 'index.js') {
            // eslint-disable-next-line
            files[file.split('.')[0]] = require(pathResolve(dir, `./${file}`));
        }
    });
    return files;
};

const sortObjectByValues = obj => {
    const res = Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    return res;
};

module.exports = exportDirFiles();
module.exports.exportDirFiles = exportDirFiles;
module.exports.sortObjectByValues = sortObjectByValues;

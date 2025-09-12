const { getAdbPath, getScrcpyPath } = require('./utils/getScrcpyPath');
const fs = require('fs');

console.log('=== 路径测试 ===');
console.log('process.resourcesPath:', process.resourcesPath);
console.log('__dirname:', __dirname);

try {
    const adbPath = getAdbPath();
    const scrcpyPath = getScrcpyPath();

    console.log('\nADB路径:', adbPath);
    console.log('ADB文件存在:', fs.existsSync(adbPath));

    console.log('\nScrcpy路径:', scrcpyPath);
    console.log('Scrcpy文件存在:', fs.existsSync(scrcpyPath));

    if (fs.existsSync(adbPath)) {
        const stats = fs.statSync(adbPath);
        console.log('ADB文件权限:', stats.mode.toString(8));
    }

} catch (error) {
    console.error('错误:', error.message);
}

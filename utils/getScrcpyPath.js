const path = require("path")

/**
 * 获取应用的基础路径
 * @returns {string} 应用基础路径
 */
function getBasePath() {
    // 检查是否为开发环境
    if (process.env.NODE_ENV === 'development' || !process.resourcesPath) {
        // 开发环境：使用相对路径
        return path.resolve(__dirname, "..");
    } else {
        // 生产环境：在打包后的应用中，使用 resourcesPath
        return path.join(process.resourcesPath, "app.asar.unpacked");
    }
}

/**
 * 判断设备类型并输出对应的 scrcpy 路径
 * @returns {string} scrcpy可执行文件路径
 */
function getScrcpyPath() {
    const basePath = getBasePath();

    switch (process.platform) {
        case "win32":
            return path.join(basePath, "bin", "win", "scrcpy.exe");
        case "darwin":
            return path.join(basePath, "bin", "mac", "scrcpy");
        case "linux":
            return path.join(basePath, "bin", "linux", "scrcpy");
        default:
            throw new Error(`Unsupported platform: ${process.platform}`);
    }
}

/**
 * 判断设备类型并输出对应的 adb 路径
 * @returns {string} adb可执行文件路径
 */
function getAdbPath() {
    const basePath = getBasePath();

    switch (process.platform) {
        case "win32":
            return path.join(basePath, "bin", "win", "adb.exe");
        case "darwin":
            return path.join(basePath, "bin", "mac", "adb");
        case "linux":
            return path.join(basePath, "bin", "linux", "adb");
        default:
            throw new Error(`Unsupported platform: ${process.platform}`);
    }
}

module.exports = {
    getScrcpyPath,
    getAdbPath
}
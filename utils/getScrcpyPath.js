/**
 * 判断设备类型并输出对应的路径
 * @returns {string} scrcpy可执行文件路径
 */
function getScrcpyPath() {
    const isDev = process.env.NODE_ENV === "development";
    const basePath = isDev ? __dirname : process.resourcesPath;

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

module.exports = {
    getScrcpyPath
}
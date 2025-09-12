const { ipcMain } = require('electron');
const path = require('path');
const { getScrcpyPath, getAdbPath } = require('../utils/getScrcpyPath');
const { exec, spawn } = require('child_process');

/**
 * 返回adb信息
 */
function getAdbDeviceInfo() {
    ipcMain.handle("check-usb-device", async () => {
        return new Promise((resolve, reject) => {
            const adbPath = getAdbPath();
            exec(`"${adbPath}" devices`, (err, stdout) => {
                if (err) {
                    return reject(err);
                }
                const lines = stdout.split("\n").slice(1);
                const devices = lines
                    .map(line => line.trim())
                    .filter(line => line && line.endsWith("device"))
                    .map(line => line.split("\t")[0]);

                resolve(devices); // 返回设备 ID 数组
            });
        });
    })
}

/**
 * 返回设备的参数信息
 */
function getDeviceInfo() {
    const execAsync = (cmd, deviceId) => {
        return new Promise((resolve) => {
            const adbPath = getAdbPath();
            const fullCmd = deviceId ? `"${adbPath}" -s ${deviceId} ${cmd}` : `"${adbPath}" ${cmd}`;
            exec(fullCmd, { encoding: "utf8" }, (err, stdout) => {
                if (err) {
                    console.warn(`[ADB] 命令失败: ${fullCmd}`, err.message);
                    resolve(""); // 失败返回空
                } else {
                    resolve(stdout.trim());
                }
            });
        });
    };

    ipcMain.handle("get-device-info", async (event, deviceId) => {
        if (!deviceId) {
            return null;
        }

        try {
            // 所有命令并行执行，提升性能
            const [
                model,
                brand,
                manufacturer,
                cpu,
                androidVersion,
                sdkVersion,
                securityPatch,
                resolutionRaw,
                densityRaw,
                batteryRaw,
                uptimeRaw
            ] = await Promise.all([
                execAsync("shell getprop ro.product.model"),
                execAsync("shell getprop ro.product.brand"),
                execAsync("shell getprop ro.product.manufacturer"),
                execAsync("shell getprop ro.product.cpu.abi"),
                execAsync("shell getprop ro.build.version.release"),
                execAsync("shell getprop ro.build.version.sdk"),
                execAsync("shell getprop ro.build.version.security_patch"),
                execAsync("shell wm size"),
                execAsync("shell wm density"),
                execAsync("shell dumpsys battery"),
                execAsync("shell cat /proc/uptime")
            ]);

            // 解析分辨率
            let resolution = "未知";
            if (resolutionRaw.includes("Physical size")) {
                const match = resolutionRaw.match(/Physical size:\s*(\d+x\d+)/);
                if (match) resolution = match[1];
            }

            // 解析密度
            let density = "未知";
            if (densityRaw && /^\d+$/.test(densityRaw)) {
                density = densityRaw;
            }

            // 解析电池电量（兼容 Windows/Linux/macOS）→ 用 Node.js 自己解析
            let batteryLevel = null;
            if (batteryRaw) {
                const lines = batteryRaw.split('\n');
                for (const line of lines) {
                    const match = line.match(/level\s*:\s*(\d+)/);
                    if (match) {
                        batteryLevel = parseInt(match[1], 10);
                        break;
                    }
                }
            }

            // 解析运行时间
            let uptimeSeconds = 0;
            if (uptimeRaw) {
                const [upTimeStr] = uptimeRaw.split(' ');
                uptimeSeconds = parseFloat(upTimeStr) || 0;
            }
            const uptimeFormatted = formatUptime(uptimeSeconds);

            return {
                serial: deviceId,
                model: model || "未知",
                brand: brand || "未知",
                manufacturer: manufacturer || "未知",
                cpu: cpu || "未知",
                androidVersion: androidVersion || "未知",
                sdkVersion: sdkVersion ? parseInt(sdkVersion, 10) : null,
                securityPatch: securityPatch || "未知",
                resolution,
                density: `${density} dpi`,
                batteryLevel,
                uptime: uptimeFormatted,
                // 可选：添加设备是否在线（如果前面命令都成功，基本认为在线）
                connected: true
            };
        } catch (err) {
            console.error("[get-device-info] 未知错误:", err);
            return null;
        }
    });
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts = [];
    if (days > 0) parts.push(`${days}天`);
    if (hours > 0) parts.push(`${hours}小时`);
    if (minutes > 0) parts.push(`${minutes}分钟`);

    return parts.length > 0 ? parts.join(' ') : "0分钟";
}

/**
 * 返回当前ADB链接的设备截图
 * @returns base64的图片
 */
function returnDeviceScreenshot() {
    ipcMain.handle("get-device-screenshot", async (event, deviceId) => {
        return new Promise((resolve, reject) => {
            const adbPath = getAdbPath();
            const child = spawn(adbPath, ["-s", deviceId, "exec-out", "screencap", "-p"], { stdio: ["ignore", "pipe", "pipe"] });
            const chunks = [];

            child.stdout.on("data", (chunk) => chunks.push(chunk));
            child.stderr.on("data", (chunk) => console.error(chunk.toString()));

            child.on("close", () => {
                const buffer = Buffer.concat(chunks);
                resolve(`data:image/png;base64,${buffer.toString("base64")}`);
            });

            child.on("error", (err) => reject(err));
        });
    });
}

/**
 * 打开scrcpy
 */
function openScrcpy() {
    ipcMain.handle("open-scrcpy", async (event, deviceId) => {
        try {
            const scrcpyPath = getScrcpyPath();

            // 参数拼接
            const args = deviceId
                ? ["-s", deviceId, "--always-on-top"]
                : ["--always-on-top"];

            console.log("启动 scrcpy:", scrcpyPath, args.join(" "));

            // spawn 启动 scrcpy
            const child = spawn(scrcpyPath, args, { stdio: "inherit" });

            child.on("close", (code) => {
                console.log(`scrcpy exited with code ${code}`);
            });

            return { success: true, message: "scrcpy 已启动" };
        } catch (err) {
            console.error("启动 scrcpy 出错:", err);
            return { success: false, message: err.message };
        }
    });
}

/**
 * 发送重启命令
 */
function sendReboot() {
    ipcMain.handle("send-reboot", async (event, deviceId) => {
        return new Promise((resolve, reject) => {
            const adbPath = getAdbPath();
            const fullCmd = deviceId ? `"${adbPath}" -s ${deviceId} reboot` : `"${adbPath}" reboot`;
            exec(fullCmd, { encoding: "utf8" }, (err, stdout) => {
                if (err) {
                    console.warn(`[ADB] 命令失败: ${fullCmd}`, err.message);
                    resolve({ success: false, message: err.message }); // 失败返回空
                } else {
                    resolve({ success: true, message: "设备已重启" });
                }
            });
        });
    });
}

module.exports = {
    getAdbDeviceInfo,
    openScrcpy,
    returnDeviceScreenshot,
    getDeviceInfo,
    sendReboot
}
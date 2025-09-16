const { app, BrowserWindow } = require('electron');
const path = require('path');
const requestPath = path.join(__dirname, 'api', 'request');
const { getAdbDeviceInfo,
    openScrcpy,
    returnDeviceScreenshot,
    getDeviceInfo,
    sendReboot,
    sendBackKey,
    sendLockScreen,
    sendHomeKey,
    sendBootloader,
    sendUnlockBootloader,
    sendLockBootloader,
    sendFactoryReset,
    sendRecoveryMode,
    sendAdbCommand,
    installApk,
    openFileDialog,
    exportUserInstalledPackages,
    getCurrentLayoutXml
} = require(requestPath);

// 注册所有 IPC 处理程序
getAdbDeviceInfo();
openScrcpy();
returnDeviceScreenshot();
getDeviceInfo();
sendReboot();
sendBackKey();
sendLockScreen();
sendHomeKey();
sendBootloader();
sendUnlockBootloader();
sendLockBootloader();
sendFactoryReset();
sendRecoveryMode();
sendAdbCommand();
installApk();
openFileDialog();
exportUserInstalledPackages();
getCurrentLayoutXml();

/**
 * 创建Windows窗口
 */
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Fishing Artifact",
        webPreferences: {
            contextIsolation: true, // 保护上下文
            nodeIntegration: true, // 禁用Node.js（为了安全）
            preload: path.join(__dirname, 'preload.js') // 预加载
        },
        icon: path.join(__dirname, 'assets', 'icon', 'nodata-search.png'), // 应用图标
        autoHideMenuBar: true
    });

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:3000');
    } else {
        win.loadFile(path.join(__dirname, 'client', 'build', 'index.html'));
    }

    // 开发者工具(dev使用)
    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
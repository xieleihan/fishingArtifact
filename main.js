const {app,BrowserWindow} = require('electron');
const path = require('path');
const requestPath = path.join(__dirname, 'api', 'request');
const { getAdbDeviceInfo, openScrcpy, returnDeviceScreenshot, getDeviceInfo, sendReboot } = require(requestPath);

getAdbDeviceInfo()
openScrcpy()
returnDeviceScreenshot()
getDeviceInfo()
sendReboot()

/**
 * 创建Windows窗口
 */
function createWindow() { 
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js') // 预加载
        },
        icon: path.join(__dirname, 'assets', 'icon', 'nodata-search.png') // 应用图标
    });

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:3000');
    } else {
        win.loadFile(path.join(__dirname, 'client', 'build', 'index.html'));
    }

    // 开发者工具(dev使用)
    if (process.env.NODE_ENV === 'development') { 
        win.webContents.openDevTools();
    } else {
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
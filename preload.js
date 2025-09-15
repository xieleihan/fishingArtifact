const { contextBridge, ipcRenderer } = require('electron');

// 在预加载脚本中使用 contextBridge 暴露安全的 API
contextBridge.exposeInMainWorld('electronAPI', {
    getVersion: () => process.versions.electron,
    openExtenal: (url) => {
        require('electron').shell.openExternal(url);
    },
    invoke: (channel, data) => {
        // 返回一个系统对话框
        return require('electron').ipcRenderer.invoke(channel, data);
    },
    sendAdbCommand: (command, deviceId = null) => ipcRenderer.invoke("send-adb-command", deviceId, command),
    installApk: (apkPath) => ipcRenderer.invoke("install-apk", apkPath),
    openFileDialog: () => ipcRenderer.invoke('ELECTRON_OPEN_FILE_DIALOG'),
});
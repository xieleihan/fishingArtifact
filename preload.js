const { contextBridge } = require('electron');

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

});
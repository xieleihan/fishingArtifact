
declare global {
    interface Window {
        electronAPI: {
            invoke: (channel: string, ...args: any[]) => Promise<any>;
            send: (channel: string, ...args: any[]) => void;
            on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
            sendAdbCommand: (command: string, deviceId?: string | null) => Promise<{ success: boolean, message: string }>;
            getVersion: () => string;
            openExtenal: (url: string) => void;
            installApk: (filePath: string) => Promise<{ success: boolean, message: string }>;
            openFileDialog: () => Promise<{ canceled: boolean; filePaths: string[] }>;
        };
    }
}

export { };

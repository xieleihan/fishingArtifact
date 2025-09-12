
declare global {
    interface Window {
        electronAPI: {
            invoke: (channel: string, ...args: any[]) => Promise<any>;
            send: (channel: string, ...args: any[]) => void;
            on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
        };
    }
}

export { };

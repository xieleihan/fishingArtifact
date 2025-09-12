import { useEffect, useState } from "react";
import '../styles/DevicePages.scss';
import { Card } from "antd";
interface deviceInfoProps {
    androidVersion: string;
    batteryLevel: number;
    brand: string;
    connected: boolean;
    cpu: string;
    density: string;
    manufacturer: string;
    model: string;
    resolution: string;
    sdkVersion: number;
    securityPatch: string;
    serial: string;
    uptime: string;
}

function DevicePages() {
    const [device, setDevice] = useState<string | null>(null); // ADB设备的id
    const [screenshot, setScreenshot] = useState<string>("");
    const [connected, setConnected] = useState<boolean>(false); // 设备连接状态
    const [deviceInfo, setDeviceInfo] = useState<deviceInfoProps>({
        androidVersion: "未知",
        batteryLevel: 0,
        brand: "未知",
        connected: false,
        cpu: "未知",
        density: "未知 dpi",
        manufacturer: "未知",
        model: "未知",
        resolution: "未知",
        sdkVersion: 0,
        securityPatch: "未知",
        serial: "",
        uptime: "0分钟"
    });

    // 初始化获取设备
    useEffect(() => {
        const checkDevice = async () => {
            if (window.electronAPI) {
                try {
                    const devices: string[] = await window.electronAPI.invoke("check-usb-device");
                    if (devices.length > 0) {
                        setDevice(devices[0]); // 只取第一个设备
                        setConnected(true);
                    } else {
                        setDevice(null);
                        setConnected(false);
                    }
                } catch (err) {
                    console.error("检查设备失败", err);
                    setDevice(null);
                    setConnected(false);
                }
            }
        };

        checkDevice();

        // 每 1s 检查一次设备状态
        const checkInterval = setInterval(checkDevice, 1000);
        return () => clearInterval(checkInterval);
    }, []);

    // 定时获取截图
    useEffect(() => {
        let interval: NodeJS.Timer;
        if (window.electronAPI && device && connected) {
            const fetchScreenshot = async () => {
                try {
                    const imgBase64 = await window.electronAPI.invoke("get-device-screenshot", device);
                    setScreenshot(imgBase64);
                } catch (err) {
                    console.error("获取截图失败", err);
                    setScreenshot(""); // 断开设备后清空截图
                    setConnected(false);
                    setDevice(null);
                }
            };

            fetchScreenshot(); // 立即抓一张
            interval = setInterval(fetchScreenshot, 500); // 每 500ms 更新
        }

        return () => clearInterval(interval);
    }, [device, connected]);

    useEffect(() => {
        const fetchDeviceInfo = async () => {
            if (!window.electronAPI || !device) return; // 无设备，不请求

            try {
                const info = await window.electronAPI.invoke("get-device-info", device);
                console.log("设备信息:", info);
                setDeviceInfo(info);
            } catch (err) {
                console.error("获取设备信息失败", err);
            }
        };

        fetchDeviceInfo();
    }, [device]);

    return (
        <section className="devicePages">
            <div className="top">
                {device && connected ? (
                    <div className="details">
                        <img
                            src={screenshot || "/preview.png"}
                            alt="scrcpy预览"
                            loading="lazy"
                            className="preview"
                        />
                        <div className="info">
                            <Card title="设备信息">
                                <span>当前安卓版本:{deviceInfo.androidVersion}</span>
                                <span>当前设备电量:{deviceInfo.batteryLevel}</span>
                                <span>设备品牌:{deviceInfo.brand}</span>
                                <span>设备CPU架构:{deviceInfo.cpu}</span>
                                <span>设备屏幕密度:{deviceInfo.density}</span>
                                <span>设备制造商:{deviceInfo.manufacturer}</span>
                                <span>设备型号:{deviceInfo.model}</span>
                                <span>设备分辨率:{deviceInfo.resolution}</span>
                                <span>SDK版本:{deviceInfo.sdkVersion}</span>
                                <span>安全补丁级别:{deviceInfo.securityPatch}</span>
                                <span>设备序列号:{deviceInfo.serial}</span>
                                <span>设备已运行时间:{deviceInfo.uptime}</span>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <p>未检测到设备</p>
                )}
            </div>
        </section>
    );
}

export default DevicePages;

import { useEffect, useState } from "react";
import '../styles/DevicePages.scss';
import { Card, Descriptions, Button,Image,Modal } from "antd";
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

    const [open, setOpen] = useState(false); // 控制模态框显示
    const [confirmLoading, setConfirmLoading] = useState(false); // 确认按钮加载状态
    const [modalText, setModalText] = useState(''); // 模态框内容

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
                const imgBase64 = await window.electronAPI.invoke("get-device-screenshot", device);
                setScreenshot(imgBase64);
                
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

    function handleConnect() {
        window.electronAPI.invoke("open-scrcpy");
    }

    function handleReboot() { 
        setOpen(true);
        setModalText("一键重启将会立即重启设备，未保存的数据将会丢失，是否继续？");
    }

    const handleOk = () => {
        setModalText("正在重启设备，请稍后...");
        setConfirmLoading(true);
        window.electronAPI.invoke("send-reboot",device).then(() => {
            setModalText("重启命令已发送，设备正在重启中...");
            setTimeout(() => {
                setOpen(false);
                setConfirmLoading(false);
            }, 2000);
        }).catch((err: any) => {
            setModalText("重启设备失败，请稍后再试");
            console.error("重启设备失败", err);
            setTimeout(() => {
                setOpen(false);
                setConfirmLoading(false);
            }, 2000);
        });
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <section className="devicePages">
            <div className="top">
                {device && connected ? (
                    <div className="details">
                        <div className="details_left">
                            <Image
                                src={screenshot}
                                alt="scrcpy预览"
                                className="preview"
                                preview={true}
                                fallback="https://picsum.photos/2160/3840" 
                            />
                            <div className="device_btn">
                                设备ID: {device}
                                <Button type="primary" onClick={handleConnect}>
                                    连接设备
                                </Button>
                            </div>
                            <span className="note">
                                注意：此处预览仅为截图，点击“连接设备”按钮将打开scrcpy窗口进行操作
                            </span>
                            <div className="dangerBox">
                                <Button onClick={handleReboot} className="danger" type="primary" danger>一键重启</Button>
                                <Button className="danger" type="primary" danger>一键BL模式</Button>
                            </div>
                        </div>
                        <div className="info">
                            <Card title="设备信息">
                                <Descriptions column={1} bordered size="small">
                                    <Descriptions.Item label="当前安卓版本">{deviceInfo.androidVersion}</Descriptions.Item>
                                    <Descriptions.Item label="当前设备电量">{deviceInfo.batteryLevel}%</Descriptions.Item>
                                    <Descriptions.Item label="设备品牌">{deviceInfo.brand}</Descriptions.Item>
                                    <Descriptions.Item label="设备CPU架构">{deviceInfo.cpu}</Descriptions.Item>
                                    <Descriptions.Item label="设备屏幕密度">{deviceInfo.density}</Descriptions.Item>
                                    <Descriptions.Item label="设备制造商">{deviceInfo.manufacturer}</Descriptions.Item>
                                    <Descriptions.Item label="设备型号">{deviceInfo.model}</Descriptions.Item>
                                    <Descriptions.Item label="设备分辨率">{deviceInfo.resolution}</Descriptions.Item>
                                    <Descriptions.Item label="SDK版本">{deviceInfo.sdkVersion}</Descriptions.Item>
                                    <Descriptions.Item label="安全补丁级别">{deviceInfo.securityPatch}</Descriptions.Item>
                                    <Descriptions.Item label="设备序列号">{deviceInfo.serial}</Descriptions.Item>
                                    <Descriptions.Item label="设备已运行时间">{deviceInfo.uptime}</Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <p>未检测到设备</p>
                )}
            </div>
            <Modal
                title="危险操作警告"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>{modalText}</p>
            </Modal>
        </section>
    );
}

export default DevicePages;

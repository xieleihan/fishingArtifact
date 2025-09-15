import '../styles/UploadfilePages.scss';
import { Button, message } from "antd";
import { useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import { useState } from "react";

function UploadfilePages() {
    const navigate = useNavigate();
    const [filePath, setFilePath] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    // 使用 Electron dialog 选择文件
    const handleSelectFile = async () => {
        try {
            const result = await window.electronAPI.openFileDialog();
            if (!result.canceled && result.filePaths.length > 0) {
                const selectedPath = result.filePaths[0];
                if (!selectedPath.endsWith(".apk")) {
                    messageApi.error("请选择 APK 文件！");
                    return;
                }
                setFilePath(selectedPath);
                messageApi.success("文件已选择：" + selectedPath);
            }
        } catch (err: any) {
            messageApi.error("选择文件失败：" + err.message);
        }
    };

    // 安装 APK
    const handleInstall = () => {
        if (!filePath) {
            messageApi.error("请先选择 APK 文件！");
            return;
        }

        window.electronAPI.installApk(filePath)
            .then((res: any) => {
                if (res.success) {
                    messageApi.success("安装成功！");
                    setFilePath(null);
                } else {
                    messageApi.error("安装失败: " + res.message);
                }
            })
            .catch((err: any) => {
                messageApi.error("执行出错: " + err.message);
            });
    };

    return (
        <>
            {contextHolder}
            <section className='uploadfilePages'>
                <div className="top">
                    <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>
                        返回上一页
                    </Button>
                </div>
                <div className="container">
                    <Button
                        type="default"
                        onClick={handleSelectFile}
                        style={{ marginBottom: 10 }}
                    >
                        选择 APK 文件
                    </Button>
                    <br />

                    {filePath && (
                        <div style={{ marginBottom: 10 }}>
                            <strong>已选文件：</strong> {filePath.split('\\').pop()?.split('/').pop()}
                        </div>
                    )}

                    <Button
                        type="primary"
                        onClick={handleInstall}
                        disabled={!filePath}
                    >
                        安装 APK
                    </Button>
                </div>
            </section>
        </>
        
    )
}

export default UploadfilePages;
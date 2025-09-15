import '../styles/TerminalPages.scss';
import { Input, Button } from "antd";
import { useState } from 'react';

function TerminalPages() {
    const [command, setCommand] = useState<string[]>([]); // 存储命令历史记录
    const [currentCommand, setCurrentCommand] = useState(''); // 当前输入的命令

    const handleSendCommand = async () => {
        if (!currentCommand.trim()) return;

        try {
            const result = await window.electronAPI.sendAdbCommand(currentCommand); // deviceId 可传 null
            console.log('ADB输出:', result.message);
            setCommand(prev => [...prev, currentCommand, result.message]);
        } catch (err) {
            console.error('ADB出错:', err);
        }

        setCurrentCommand('');
    }

    return (
        <>
            <section className="terminalPages">
                <div className="top">
                    <Input onChange={(e) => setCurrentCommand(e.target.value)} value={currentCommand} placeholder="输入发送的ADB命令(adb前缀忽略)" />
                    <Button onClick={handleSendCommand} className='sendButton' type='primary'>发送</Button>
                </div>
                <div className="bottom">
                    <p>Microsoft Windows [版本 10.0.26100.6584]<br />
                        (c) Microsoft Corporation。保留所有权利。</p>
                    <br />
                    {
                        command.map((cmd, index) => (
                            <p key={index}>Bash&gt;{cmd}
                            </p>
                        ))
                    }
                </div>
            </section>
        </>
    );
}

export default TerminalPages;
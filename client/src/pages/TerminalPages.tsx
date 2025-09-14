import '../styles/TerminalPages.scss';
import { Input,Button } from "antd";

function TerminalPages() {
    return (
        <>
            <section className="terminalPages">
                <div className="top">
                    <Input placeholder="输入发送的ADB命令" />
                    <Button className='sendButton' type='primary'>发送</Button>
                </div>
            </section>
        </>
    );
}

export default TerminalPages;
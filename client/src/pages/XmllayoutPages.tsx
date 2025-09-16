import '../styles/XmllayoutPages.scss';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import xmlFormatter from "xml-formatter";

function XmlLayoutPages() {
    const [xmlData, setXmlData] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const response = await window.electronAPI.invoke('get-current-layout-xml');
            console.log(response, '当前布局xml---');
            const rawXml = response.xml;
            const startIndex = rawXml.indexOf("<?xml");
            if (startIndex !== -1) {
                const xmlContent = rawXml.substring(startIndex);
                console.log(xmlContent);
                setXmlData(xmlFormatter(xmlContent));
            } else {
                console.error("未找到 XML 内容");
            }
        })();
    }, []);

    return (
        <>
            <section className='xmlLayoutPages'>
                <div className="container">
                    <SyntaxHighlighter language="xml" style={prism} showLineNumbers>
                        {xmlData || '正在加载...'}
                    </SyntaxHighlighter>
                </div>
            </section>
        </>
    )
}

export default XmlLayoutPages;
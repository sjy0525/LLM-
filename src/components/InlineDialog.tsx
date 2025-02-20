import { useState } from 'react';
import './InlineDialog.scss';
import { Input, Button, message as antdMessage } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useUserStore } from '../store';
import useCozeChat from '../hooks/useCozeChat';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';

const InlineInput = () => {
    const { userName, botId } = useUserStore();
    const [inputText, setInputText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});

    const { sendMessage, messages: cozeMessages } = useCozeChat();

    // 发送消息
    const handleSend = async () => {
        if (!userName || !botId) {
            antdMessage.error('请确保用户名和Bot ID均已设置');
            return;
        }

        if (inputText.trim() === '' && !selectedFile) {
            antdMessage.warning('请输入消息或选择文件');
            return;
        }

        // 更新本地消息列表
        setInputText('');
        setSelectedFile(null);

        try {
            // 发送消息到 Coze
            await sendMessage(inputText.trim(), botId);
        } catch (error) {
            console.error("发送消息失败:", error);
            antdMessage.error("消息发送失败，请检查网络连接");
        }
    };

    const handleCopy = (_code: string, index: string) => {
        setCopiedStates({ ...copiedStates, [index]: true });
        setTimeout(() => {
            setCopiedStates({ ...copiedStates, [index]: false });
        }, 2000);
    };

    return (
        <div className="Inline">
            <div className="InlineInput">
                <Input
                    placeholder="请输入消息..."
                    className="InputField"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <Button
                    shape="circle"
                    icon={<ArrowUpOutlined />}
                    onClick={handleSend}
                />
            </div>

            <div className="messages">
                {cozeMessages.map((message, index) => (
                    <div
                        key={`coze-${index}`}
                        className={`message ${message.role === "user" ? "user-message" : "bot-message"}`}
                    >
                        <ReactMarkdown
                            components={{
                                code({ inline, className, children }: { inline?: boolean; className?: string; children: React.ReactNode }) {
                                    // 只有非内联且有语言标记的代码块才会被特殊处理
                                    const match = /language-(\w+)/.exec(className || '');
                                    const codeId = `code-${index}-${Math.random()}`;
                                    
                                    // 检查是否为被```包裹的代码块
                                    if (!inline && match) {
                                        return (
                                            <div className="code-block">
                                                <div className="code-header">
                                                    <span className="language-tag">{match[1]}</span>
                                                    <CopyToClipboard text={String(children)} onCopy={() => handleCopy(String(children), codeId)}>
                                                        <Button 
                                                            type="text" 
                                                            icon={copiedStates[codeId] ? <CheckOutlined /> : <CopyOutlined />}
                                                            className="copy-button"
                                                        >
                                                            {copiedStates[codeId] ? '已复制' : '复制代码'}
                                                        </Button>
                                                    </CopyToClipboard>
                                                </div>
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        );
                                    }
                                    
                                    // 其他所有内容（包括内联代码）都以普通文本显示
                                    return <code className={className}>{children}</code>;
                                },
                                img({ src, alt }) {
                                    // 确保src是有效的URL
                                    if (!src) return null;
                                    
                                    return (
                                        <div className="message-image-container">
                                            <img
                                                src={src}
                                                alt={alt || '图片'}
                                                className="message-image"
                                                style={{
                                                    display: 'block',
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    borderRadius: '8px',
                                                    margin: '10px 0',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                }}
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    );
                                },
                                a({  href, children }) {
                                    // 检查链接是否为Coze图片链接或常规图片链接
                                    if (href && (href.match(/^https:\/\/s\.coze\.cn\/t\/.+/i) || href.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
                                        return (
                                            <div className="message-image-container">
                                                <img
                                                    src={href}
                                                    alt={String(children) || '图片'}
                                                    className="message-image"
                                                    style={{
                                                        display: 'block',
                                                        maxWidth: '100%',
                                                        height: 'auto',
                                                        borderRadius: '8px',
                                                        margin: '10px 0',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        );
                                    }
                                    // 对于非图片链接，保持默认的链接行为
                                    return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
                                }
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InlineInput;

import { useState } from 'react';
import './InlineDialog.scss';
import { Input, Button, message as antdMessage } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useUserStore } from '../store';
import useCozeChat from '../hooks/useCozeChat';

const InlineInput = () => {
    const { userName, botId } = useUserStore();
    const [inputText, setInputText] = useState(''); // 输入框内容
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // 选中的文件

    // 使用 Coze Hook 处理聊天逻辑
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

            {/* 消息列表 */}
            <div className="messages">
                {cozeMessages.map((message, index) => (
                    <div
                        key={`coze-${index}`}
                        className={`message ${message.role === "user" ? "user-message" : "bot-message"}`}
                    >
                        {message.content}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default InlineInput;

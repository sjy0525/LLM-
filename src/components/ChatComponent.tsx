// src/components/ChatComponent.tsx
import React, { useState } from 'react';
import useCozeChat from '../hooks/useCozeChat';

const ChatComponent: React.FC = () => {
    const [inputMessage, setInputMessage] = useState('');
    const { messages, loading, error, sendMessage, conversationId } = useCozeChat();

    const handleSendMessage = () => {
        if (inputMessage.trim() === '') return;
        sendMessage(inputMessage, '7475704281941884968'); // 替换为你的实际 bot ID
        setInputMessage('');
    };

    return (
        <div>
            {/* 显示消息列表 */}
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        <span>{message.role}: </span>
                        <span>{message.content}</span>
                        <span>conversationId:{conversationId}</span>
                    </div>
                ))}
            </div>
            {/* 显示错误信息 */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* 输入框和发送按钮 */}
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="输入消息..."
            />
            <button onClick={handleSendMessage} disabled={loading}>
                {loading ? '发送中...' : '发送'}
            </button>
        </div>
    );
};

export default ChatComponent;
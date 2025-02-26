import { useState } from 'react';
import { CozeAPI, COZE_CN_BASE_URL, ChatEventType, RoleType } from '@coze/api';

import { useUserStore } from '../store/index'

// 创建 Coze API 客户端实例
const client = new CozeAPI({
    token: useUserStore.getState().cozeToken, // 从store中获取token
    baseURL: COZE_CN_BASE_URL,
    allowPersonalAccessTokenInBrowser: true
});

// 定义自定义 Hook
const useCozeChat = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null); // 新增状态用于存储 conversation_id

    // 定义发送消息的函数
    const sendMessage = async (message: string, botId: string) => {
        setLoading(true);
        setError(null);

        try {
            // 先将用户消息添加到消息列表中
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    role: RoleType.User,
                    content: message,
                    content_type: 'text'
                }
            ]);

            const stream = await client.chat.stream({
                bot_id: botId,
                additional_messages: [
                    {
                        role: RoleType.User,
                        content: message,
                        content_type: 'text',
                    },
                ],
            });

            let botMessage = '';
            // 先添加一个空的助手消息
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    role: RoleType.Assistant,
                    content: '',
                    content_type: 'text'
                }
            ]);

            for await (const part of stream) {
                if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
                    if (part.data.conversation_id) {
                        setConversationId(part.data.conversation_id);
                    }
                    botMessage += part.data.content;
                    // 更新最后一条消息的内容
                    setMessages(prevMessages => {
                        const newMessages = [...prevMessages];
                        newMessages[newMessages.length - 1].content = botMessage;
                        return newMessages;
                    });
                }
            }
        } catch (err) {
            setError('消息发送失败，请稍后重试。');
            console.error('Coze API 请求出错:', err);
        } finally {
            setLoading(false);
        }
    };
    console.log(messages)

    return { messages, loading, error, sendMessage, conversationId };
};

export default useCozeChat;
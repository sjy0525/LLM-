import { useState } from 'react';
import { CozeAPI, COZE_CN_BASE_URL, ChatEventType, RoleType } from '@coze/api';

// 创建 Coze API 客户端实例
const client = new CozeAPI({
    token: 'pat_h37Qf1kFZc0W2e0WcJ4zxYraa8JD6LVwyhOGdVorQo1YD9Qynt84JchqF3bqWDLd', // 替换为你的实际 PAT 令牌
    baseURL: COZE_CN_BASE_URL,
    allowPersonalAccessTokenInBrowser: true
});

// 定义自定义 Hook
const useCozeChat = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
            for await (const part of stream) {
                if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
                    botMessage += part.data.content;
                    // 更新消息列表中的机器人消息
                    setMessages(prevMessages => {
                        const newMessages = [...prevMessages];
                        const lastMessageIndex = newMessages.findIndex(msg => msg.role === RoleType.Assistant);
                        if (lastMessageIndex === -1) {
                            // 如果还没有机器人消息，添加一条新的
                            newMessages.push({
                                role: RoleType.Assistant,
                                content: botMessage,
                                content_type: 'text'
                            });
                        } else {
                            // 更新已有的机器人消息
                            newMessages[lastMessageIndex].content = botMessage;
                        }
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

    return { messages, loading, error, sendMessage };
};

export default useCozeChat;
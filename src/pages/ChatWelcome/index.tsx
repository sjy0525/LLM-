import './chatWelcome.scss';
import InputBox from '../../components/InputBox';
import {
  OpenAIOutlined,
} from '@ant-design/icons';
import useCozeChat from '../../hooks/useCozeChat'; // 引入 useCozeChat Hook
import React from 'react';
import InlineDialog from '../InlineDialog';

const ChatWelcome = () => {
  const { messages } = useCozeChat(); // 获取聊天消息
  const [showWelcome, setShowWelcome] = React.useState(true); // 控制欢迎内容显示的状态

  React.useEffect(() => {
    // 当有新消息时，隐藏欢迎内容
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages]);

  return (
    <div className='chat-container'>
      <InlineDialog />
      <div className='chat'>
        {showWelcome && (
          <div className='chat-welcome'>
            <p className='chat-welcome-title'><OpenAIOutlined /> 我是 LLM-Chat 助手，很高兴见到你！</p>
            <p className='chat-welcome-content'>我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~</p>
            <InputBox />
          </div>
        )}
        {/* 显示聊天消息 */}
        {!showWelcome && (
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index}>
                <span>{message.role}: </span>
                <span>{message.content}</span>
              </div>
            ))}
            <InputBox /> {/* 保持输入框在消息下方 */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWelcome;

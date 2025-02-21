import { useState, useEffect } from "react";
import { OpenAIOutlined } from "@ant-design/icons";
// import useCozeChat from "../../hooks/useCozeChat";
import InputBox from "../../components/InputBox";
import InlineDialog from "../InlineDialog";
import "./chatWelcome.scss";

interface Messages {
  role: string;
  content: string;
}

const ChatWelcome = () => {
  // const { messages } = useCozeChat(); // 获取聊天消息
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessage] = useState<Messages[]>([]);

  // 监听 messages 数组的变化
  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false); // 当 messages 数量大于 0 时隐藏欢迎消息
      console.log("messages updated in ChatWelcome:", messages); // 添加日志输出
    }
  }, [messages]); // 每次 messages 更新时触发该 effect
  const handleMessageReceived = (newMessages: Messages[]) => {
    setMessage(newMessages);
    console.log("messages", messages);

  }

  return (
    <div className="chat-container">
      <InlineDialog />
      <div className="chat">
        {showWelcome && (
          <div className="chat-welcome">
            <p className="chat-welcome-title">
              <OpenAIOutlined /> 我是 LLM-Chat 助手，很高兴见到你！
            </p>
            <p className="chat-welcome-content">
              我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~
            </p>
            <InputBox onMessageReceived={handleMessageReceived} />
          </div>
        )}
        {!showWelcome && (
          <div className="chat-messages-container">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.role === "user" ? "user" : "assistant"}`}
                >

                  {message.content}
                </div>
              ))}
            </div>
            <InputBox onMessageReceived={handleMessageReceived} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWelcome;

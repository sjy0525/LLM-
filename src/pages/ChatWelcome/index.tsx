import './chatWelcome.scss';
import InputBox from '../../components/InputBox';
import {
  OpenAIOutlined,
} from '@ant-design/icons';


const ChatWelcome = () => {

  return (
    <div className='chat'>
      <div className='chat-welcome'>
        <p className='chat-welcome-title'><OpenAIOutlined /> 我是 LLM-Chat 助手，很高兴见到你！</p>
        <p className='chat-welcome-content'>我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~</p>
        <InputBox />
      </div>
    </div>
  )
}

export default ChatWelcome;

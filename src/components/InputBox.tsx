import { useState } from "react";
import { Button, Input } from 'antd';
import {
  GlobalOutlined,
  ArrowUpOutlined,
  PaperClipOutlined
} from '@ant-design/icons';
import './inputBox.scss';

const { TextArea } = Input;

const InputBox = () => {

  const [value, setValue] = useState('');

  return (
    <div className="inputBox">
      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="给LLM-Chat助手发送消息吧~"
        autoSize={{ minRows: 3, maxRows: 15 }}
        className="inputBox-textarea"
      />
      <div className="toolBar">
        <div className="toolBar-left">
          <Button shape="round" icon={<GlobalOutlined />}>
            联网搜索
          </Button>
        </div>
        <div className="toolBar-right">
          <Button shape="circle" ghost icon={<PaperClipOutlined />} className="button"></Button>
          <Button shape="circle" icon={<ArrowUpOutlined />}></Button>
        </div>
      </div>
    </div>
  );
};

export default InputBox;
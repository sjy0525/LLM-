// import React from 'react';
import "./InlineDialog.scss"
import { Input, Button, message as antdMessage } from "antd"
import { PaperClipOutlined, ArrowUpOutlined } from "@ant-design/icons"
import { useUserStore } from "../store"

const InlineInput = () => {
  const { userName, cozeToken, botId } = useUserStore()

  const handleSend = () => {
    if (!userName || !cozeToken || !botId) {
      antdMessage.error("请确保用户名、Token和Bot ID均已设置")
      return
    }
    // 处理发送消息后的逻辑
  }
  return (
    <div className="InlineInput">
      <Input placeholder="请搜索..." className="InputField" />
      <Button
        shape="circle"
        ghost
        icon={<PaperClipOutlined />}
        className="Paperbutton"
      ></Button>
      <Button
        shape="circle"
        icon={<ArrowUpOutlined />}
        onClick={handleSend}
      ></Button>
    </div>
  )
}

export default InlineInput

import React, { useState } from "react"
import {
  CommentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons"

import {
  Avatar,
  Button,
  Dropdown,
  Input,
  MenuProps,
  message,
  Modal,
} from "antd"
import "./home.scss"
import { Outlet, useNavigate } from "react-router-dom"
import { useUserStore } from "../../store"
import useCozeChat from "../../hooks/useCozeChat"
const Home: React.FC = () => {

  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cozeToken, setCozeToken, botId, setBotId, userName, setUserName } = useUserStore();
  const navigate = useNavigate();
  const { loading, error } = useCozeChat();


  const dropdownItems: MenuProps['items'] = [
    { key: 'account', label: userName, disabled: true, },
    { key: 'setup', label: '系统设置', icon: <SettingOutlined /> },
    { key: 'quit', label: '退出登录', icon: <LogoutOutlined /> },
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const changeKey = () => {
    navigate("/"); // 导航到根路径
    window.location.reload(); // 强制刷新页面
  };

  const onClickMenu: MenuProps['onClick'] = ({ key }) => {
    if (key === 'setup') {
      setIsModalOpen(true);
    } else if (key === 'quit') {
      message.info(`Click on item ${key}`);
    }
  }

  return (
    <div className="home">
      <div className={`sider ${collapsed ? "collapsed" : ""}`}>
        <div className="sider-top">
          {!collapsed && <span className="logo">LLM-Chat</span>}
          <Button onClick={toggleCollapsed} ghost className="collapsed-button">
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
        {!collapsed && (
          <Button
            type="primary"
            size="large"
            className="new-button"
            onClick={() => changeKey()}
          >
            <CommentOutlined />
            开启新对话
          </Button>
        )}
        <Dropdown
          menu={{ items: dropdownItems, onClick: onClickMenu }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()} className="sider-bottom fixed-bottom">
            <Avatar icon={<UserOutlined />} />
            {!collapsed && <span>&nbsp;&nbsp;个人信息</span>}
          </a>
        </Dropdown>
      </div>
      {/* <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index}>
              <span>{message.role}: </span>
              <span>{message.content}</span>
            </div>
          ))}
        </div> */}
      {/* 显示加载状态 */}
      {loading && <div className="loading">正在加载...</div>}
      {/* 显示错误信息 */}
      {error && <div className="error">{error}</div>}
      {/* 输入框组件 */}
      {/* <InputBox conversationId={activeKey} /> */}
      {/* </div> */}
      <Outlet />
      <Modal
        className="setup"
        title="系统设置"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <span>Coze Token:</span>
        <Input
          placeholder="扣子 API 通过访问令牌进行 API 请求的鉴权"
          variant="filled"
          value={cozeToken}
          onChange={(e) => setCozeToken(e.target.value)}
        />
        <span>Bot Id:</span>
        <Input
          placeholder="要进行会话聊天的智能体 ID"
          variant="filled"
          value={botId}
          onChange={(e) => setBotId(e.target.value)}
        />
        <span>用户名（仅开发期间无需登录时用）：</span>
        <Input
          placeholder="要进行会话聊天的智能体 ID"
          variant="filled"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </Modal>
    </div>
  )
}

export default Home

import React, { useState } from 'react';
import {
  CommentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';

import { Avatar, Button, Dropdown, Input, Menu, MenuProps, message, Modal } from 'antd';
import './home.scss';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';

const Home: React.FC = () => {

  const chatItems = [
    { id: '1', title: '对话 1' },
    { id: '2', title: '对话 2' },
    { id: '3', title: '对话 3' },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cozeToken, setCozeToken, username } = useUserStore();
  const navigate = useNavigate();

  const menuItems: MenuProps['items'] = [
    { key: 'account',label: username, disabled: true,},
    { key: 'setup', label: '系统设置', icon: <SettingOutlined /> },
    { key: 'quit', label: '退出登录', icon: <LogoutOutlined /> },
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const changeKey = (key: string) => {
    setActiveKey(key);
    if (key) {
      navigate(`/chat/${key}`);
    } else {
      navigate('/');
    }
  };

  const onClickMenu: MenuProps['onClick'] = ({ key }) => {
    if (key === 'setup') {
      setIsModalOpen(true);
    } else if (key === 'quit') {
      // logout
      message.info(`Click on item ${key}`);
    }
  };

  return (
    <div className='home'>
      <div className={`sider ${collapsed ? 'collapsed' : ''}`}>
        <div className='sider-top'>
          {!collapsed && <span className='logo'>LLM-Chat</span>}
          <Button onClick={toggleCollapsed} ghost className='collapsed-button'>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
        {!collapsed && <Button type="primary" size="large" className='new-button' onClick={() => changeKey('')}><CommentOutlined />开启新对话</Button>}
        <Menu
          className='sider-menu'
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[activeKey]}
        >
          {chatItems.map((item) => <Menu.Item key={item.id} onClick={() => changeKey(item.id)}>{item.title}</Menu.Item>)}
        </Menu>
        <Dropdown menu={{ items: menuItems, onClick: onClickMenu }} trigger={['click']} >
          <a onClick={(e) => e.preventDefault()} className='sider-bottom'>
            <Avatar icon={<UserOutlined />} />
            {!collapsed && <span>&nbsp;&nbsp;个人信息</span>}
          </a>
        </Dropdown>
      </div>
      <Outlet />
      <Modal title="系统设置" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} centered>
        <span>Coze Token:</span>
        <Input placeholder="Token" variant="filled" value={cozeToken} onChange={(e) => setCozeToken(e.target.value)} />
      </Modal>
    </div>
  );
};

export default Home;
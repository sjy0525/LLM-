# 字节跳动青训营-LLM 对话框组件
技术栈：React + TypeScript + Vite + Ant Design + Zustand + axios

### 操作说明
1. 配置环境 `npm install`
2. 启动项目 `npm run dev` 

### 项目框架说明

- `src/`
  - `apis/`
    - 用于存放与LLM交互的api。
  - `components/`
    - 存放项目中可复用的 React 组件。
  - `pages/`
    - 存放项目中的各个页面组件，每个页面组件通常对应一个路由。
    - `Chat/`
      - 存放聊天页面的相关代码。
    - `ChatWelcome/`
      - 存放新建聊天页面的相关代码。
    - `Home/`
      - 存放主页的相关代码。
    - `Login/`
      - 存放登录页面的相关代码。
  - `router/`
    - 存放路由配置文件，定义应用的路由结构。
  - `store/`
    - 存放状态管理相关的代码，使用 Zustand 进行状态管理。
  - `index.css`
    - 全局样式文件。
  - `main.tsx`
    - 应用的入口文件，渲染根组件。

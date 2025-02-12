import { create } from 'zustand';

// 定义 store 的状态类型
type UserState = {
  username: string;    // 账号
  cozeToken: string; // token
  setUsername: (username: string) => void; // 更新账号的函数
  setCozeToken: (cozeToken: string) => void; // 更新 token 的函数
};

// 使用 create 创建 store
const useUserStore = create<UserState>((set) => ({
  username: '', // 初始化为空
  cozeToken: '', // 初始化为空
  setUsername: (username) => set({ username }), // 更新 username
  setCozeToken: (cozeToken) => set({ cozeToken: cozeToken }), // 更新 token
}));

export {useUserStore};

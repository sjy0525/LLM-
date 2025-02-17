import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 定义 UserState 类型
type UserState = {
  userName: string;
  cozeToken: string;
  botId: string;
  setUserName: (userName: string) => void;
  setCozeToken: (cozeToken: string) => void;
  setBotId: (botId: string) => void;
  getState: () => UserState;
};

// 创建 zustand store
const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userName: '', // 默认值
      cozeToken: '', // 默认值
      botId: '', // 默认值
      setUserName: (userName) => set({ userName }),
      setCozeToken: (cozeToken) => set({ cozeToken }),
      setBotId: (botId) => set({ botId }),
      getState: () => get(), // 添加 getState 方法
    }),
    {
      name: 'user-storage', // 存储的 key 名称
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
    }
  )
);

export { useUserStore };
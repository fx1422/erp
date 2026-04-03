import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  realName: string;
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('');
  const userInfo = ref<UserInfo | null>(null);

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  function setUserInfo(info: UserInfo) {
    userInfo.value = info;
  }

  function logout() {
    token.value = '';
    userInfo.value = null;
    localStorage.removeItem('token');
  }

  function initFromLocalStorage() {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      token.value = savedToken;
    }
  }

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    logout,
    initFromLocalStorage,
  };
});

<template>
  <div class="login-container">
    <div class="background-gradient"></div>
    
    <div class="login-card">
      <div class="icon-wrapper">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
      </div>
      
      <h1 class="title">健康打卡</h1>
      <p class="subtitle">登录或注册开始你的健康之旅</p>
      
      <div class="form-content">
        <div class="input-group">
          <label class="input-label">邮箱地址</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <input
              v-model="email"
              type="email"
              placeholder="输入你的邮箱"
              class="input-field"
              @keyup.enter="sendMagicLink"
            />
          </div>
        </div>
        
        <button 
          class="btn btn-primary" 
          @click="sendMagicLink"
          :disabled="loading"
        >
          <span v-if="!loading">发送登录邮件</span>
          <span v-else class="loading-content">
            <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            发送中...
          </span>
        </button>
        
        <div class="divider">
          <span>或</span>
        </div>
        
        <button class="btn btn-secondary" @click="guest">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          匿名进入
        </button>
        
        <p v-if="msg" class="message" :class="{ 'error': isError }">
          {{ msg }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSupabase } from '~/composables/useSupabase';

const supabase = useSupabase();
const router = useRouter();
const email = ref('');
const msg = ref('');
const loading = ref(false);
const isError = ref(false);

const sendMagicLink = async () => {
  if (!email.value) {
    msg.value = '请输入邮箱';
    isError.value = true;
    return;
  }
  
  loading.value = true;
  msg.value = '';
  isError.value = false;
  
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: 'http://172.20.10.3:3000/auth/callback',
    },
  });
  
  loading.value = false;
  
  if (error) {
    msg.value = error.message;
    isError.value = true;
  } else {
    msg.value = '登录邮件已发送，请查收（魔术链接）';
    isError.value = false;
  }
};

const guest = async () => {
  router.push('/dashboard');
};
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.background-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.95;
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: float 20s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    animation: float 25s ease-in-out infinite reverse;
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease-out;
  
  @media (max-width: 640px) {
    padding: 2rem 1.5rem;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  text-align: center;
  color: #718096;
  font-size: 0.95rem;
  margin: 0 0 2rem 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #a0aec0;
  pointer-events: none;
}

.input-field {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #cbd5e0;
  }
}

.btn {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  
  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    transform: translateY(-2px);
  }
}

.btn-secondary {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  
  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 0.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
  }
  
  span {
    padding: 0 1rem;
    color: #a0aec0;
    font-size: 0.875rem;
  }
}

.message {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
  background: #e6fffa;
  color: #047857;
  border: 1px solid #a7f3d0;
  animation: fadeIn 0.3s ease-out;
  
  &.error {
    background: #fee;
    color: #c53030;
    border-color: #feb2b2;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

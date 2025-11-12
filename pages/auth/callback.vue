<template>
  <div class="min-h-screen flex items-center justify-center">
    <p v-if="msg">{{ msg }}</p>
    <p v-else>正在处理登录，请稍候...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useRouter, useRoute } from 'vue-router'

const supabase = useSupabase()
const router = useRouter()
const route = useRoute()
const msg = ref('')

onMounted(async () => {
  // Supabase 魔法链接返回的是 hash (#) 形式
  const hash = route.hash.slice(1) // 去掉 #
  const params = Object.fromEntries(new URLSearchParams(hash))

  const access_token = params.access_token
  const refresh_token = params.refresh_token

  if (!access_token || !refresh_token) {
    msg.value = '未找到登录 token 或链接已失效'
    return
  }

  // 等待设置 session 完成
  const { error } = await supabase.auth.setSession({ access_token, refresh_token })
  if (error) {
    msg.value = '登录失败: ' + error.message
    console.error(error)
    return
  }

  // 登录成功，跳转到仪表盘
  router.push('/dashboard')
})
</script>

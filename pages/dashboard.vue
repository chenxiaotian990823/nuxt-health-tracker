<template>
  <div class="page-container">
    <div class="header">
      <h2 class="title">今日打卡</h2>
      <div class="progress">
        <span class="progress-text">{{ completedCount }}/{{ items.length }}</span>
      </div>
    </div>
    
    <div class="cards-grid">
      <HealthCard 
        v-for="item in items" 
        :key="item.type" 
        :label="item.label" 
        :done="states[item.type]"
        :loading="loadingStates[item.type]"
        @toggle="toggle(item.type)" 
      />
    </div>
    
    <div class="footer">
      <NuxtLink to="/history" class="history-link">查看历史记录</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import HealthCard from '~/components/HealthCard.vue'
import { useSupabase } from '~/composables/useSupabase'
import { useHealthRecords } from '~/composables/useHealthRecords'
import dayjs from 'dayjs'
import { reactive, computed, onMounted } from 'vue'

const supabase = useSupabase()
const { getUserId, getRecordsByDate, toggleTodayRecord } = useHealthRecords()

const items = [
  { type: 'drink_water', label: '喝水' },
  { type: 'exercise', label: '运动' },
  { type: 'sleep', label: '早睡' },
  { type: 'no_sugar', label: '戒糖' }
]

const states = reactive<Record<string, boolean>>({
  drink_water: false,
  exercise: false,
  sleep: false,
  no_sugar: false
})

const loadingStates = reactive<Record<string, boolean>>({
  drink_water: false,
  exercise: false,
  sleep: false,
  no_sugar: false
})

const completedCount = computed(() => {
  return Object.values(states).filter(Boolean).length
})

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  const userId = data.user?.id
  if (!userId) return
  const today = dayjs().format('YYYY-MM-DD')
  const recs = await getRecordsByDate(userId, today)
  recs.forEach(r => { states[r.type] = true })
})

const toggle = async (type: string) => {
  if (loadingStates[type]) return
  
  const { data } = await supabase.auth.getUser()
  const userId = data.user?.id
  if (!userId) {
    alert('请先登录')
    return
  }
  
  try {
    loadingStates[type] = true
    await toggleTodayRecord(userId, type)
    states[type] = !states[type]
  } catch (e: any) {
    alert(e.message || '操作失败')
  } finally {
    loadingStates[type] = false
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 2rem 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%);
}

.header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  letter-spacing: -0.5px;
}

.progress {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 2rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.progress-text {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.history-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    background: #eff6ff;
    color: #2563eb;
  }
}
</style>

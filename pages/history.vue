<template>
  <div class="history-page">
    <div class="container">
      <h2 class="title">最近 7 天打卡记录</h2>
      
      <div class="stats-card">
        <div class="stat-item">
          <div class="stat-value">{{ totalCount }}</div>
          <div class="stat-label">总打卡数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ activeDays }}</div>
          <div class="stat-label">活跃天数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ avgPerDay }}</div>
          <div class="stat-label">日均打卡</div>
        </div>
      </div>

      <!-- 添加横向滚动容器以防止7天数据超出宽度 -->
      <div class="days-container">
        <div class="days-grid">
          <div 
            v-for="d in days" 
            :key="d.date" 
            class="day-card"
            :class="{ 'has-records': d.count > 0 }"
          >
            <div class="day-label">{{ d.label }}</div>
            <div class="day-bar">
              <div class="bar-fill" :style="{ height: getBarHeight(d.count) }"></div>
            </div>
            <div class="day-count">{{ d.count }}</div>
          </div>
        </div>
      </div>

      <div class="back-link">
        <NuxtLink to="/dashboard" class="btn-back">
          <span class="arrow">←</span>
          返回打卡
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import { useHealthRecords } from '~/composables/useHealthRecords'
import dayjs from 'dayjs'
import { ref, computed, onMounted } from 'vue'

const supabase = useSupabase()
const { getUserId, getRecordsRange } = useHealthRecords()
const days = ref<Array<{ date: string; label: string; count: number }>>([])

const totalCount = computed(() => days.value.reduce((sum, d) => sum + d.count, 0))
const activeDays = computed(() => days.value.filter(d => d.count > 0).length)
const avgPerDay = computed(() => {
  const avg = activeDays.value > 0 ? totalCount.value / activeDays.value : 0
  return avg.toFixed(1)
})

const maxCount = computed(() => Math.max(...days.value.map(d => d.count), 1))

const getBarHeight = (count: number) => {
  if (count === 0) return '0%'
  return `${(count / maxCount.value) * 100}%`
}

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  const userId = data.user?.id
  if (!userId) return

  const end = dayjs()
  const start = end.subtract(6, 'day')
  const records = await getRecordsRange(userId, start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))

  const map = new Map<string, number>()
  for (let i = 0; i < 7; i++) {
    const d = start.add(i, 'day').format('YYYY-MM-DD')
    map.set(d, 0)
  }
  records.forEach(r => {
    const day = dayjs(r.created_at).format('YYYY-MM-DD')
    map.set(day, (map.get(day) || 0) + 1)
  })
  days.value = Array.from(map.entries()).map(([date, count]) => ({
    date,
    label: dayjs(date).format('MM/DD'),
    count
  }))
})
</script>

<style lang="scss" scoped>
.history-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.stats-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.stat-item {
  text-align: center;
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
}

.days-container {
  overflow-x: auto;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.7);
    }
  }
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(90px, 1fr));
  gap: 1rem;
  min-width: min-content;
}

.day-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  }
  
  .day-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }
  
  .day-bar {
    width: 100%;
    height: 80px;
    background: #f3f4f6;
    border-radius: 0.5rem;
    position: relative;
    overflow: hidden;
    margin-bottom: 0.5rem;
    
    .bar-fill {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-radius: 0.5rem 0.5rem 0 0;
      transition: height 0.5s ease;
    }
  }
  
  .day-count {
    font-size: 1.25rem;
    font-weight: 700;
    color: #667eea;
  }
  
  &.has-records {
    border: 2px solid #667eea;
  }
}

.back-link {
  text-align: center;
  
  .btn-back {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: white;
    color: #667eea;
    border-radius: 0.5rem;
    font-weight: 600;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      background: #667eea;
      color: white;
    }
    
    .arrow {
      font-size: 1.25rem;
      transition: transform 0.3s ease;
    }
    
    &:hover .arrow {
      transform: translateX(-4px);
    }
  }
}

@media (max-width: 768px) {
  .stats-card {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .days-grid {
    grid-template-columns: repeat(7, minmax(70px, 1fr));
    gap: 0.5rem;
  }
  
  .day-card {
    padding: 0.5rem;
    
    .day-label {
      font-size: 0.75rem;
    }
    
    .day-bar {
      height: 60px;
    }
    
    .day-count {
      font-size: 1rem;
    }
  }
}
</style>

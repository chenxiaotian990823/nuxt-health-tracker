import dayjs from 'dayjs'
import { useSupabase } from './useSupabase'

export const useHealthRecords = () => {
  const supabase = useSupabase()

  const getUserId = async () => {
    const { data } = await supabase.auth.getUser()
    return data.user?.id || null
  }

  const getRecordsByDate = async (userId: string, date: string) => {
    const start = dayjs(date).startOf('day').toISOString()
    const end = dayjs(date).endOf('day').toISOString()
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', start)
      .lte('created_at', end)
    if (error) throw error
    return data || []
  }

  const toggleTodayRecord = async (userId: string, type: string, note: string | null = null) => {
    const today = dayjs().format('YYYY-MM-DD')
    const start = dayjs(today).startOf('day').toISOString()
    const end = dayjs(today).endOf('day').toISOString()

    const { data: existing, error: selErr } = await supabase
      .from('records')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .gte('created_at', start)
      .lte('created_at', end)
      .limit(1)

    if (selErr) throw selErr

    if (existing && existing.length > 0) {
      const id = existing[0].id
      const { error: delErr } = await supabase.from('records').delete().eq('id', id)
      if (delErr) throw delErr
      return { action: 'deleted' }
    } else {
      const { error: insErr } = await supabase.from('records').insert([
        { user_id: userId, type, note }
      ])
      if (insErr) throw insErr
      return { action: 'inserted' }
    }
  }

  const getRecordsRange = async (userId: string, startDate: string, endDate: string) => {
    const start = dayjs(startDate).startOf('day').toISOString()
    const end = dayjs(endDate).endOf('day').toISOString()
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', start)
      .lte('created_at', end)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
  }

  return { getUserId, getRecordsByDate, toggleTodayRecord, getRecordsRange }
}

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

let sb: SupabaseClient | null = null

export const useSupabase = () => {
  if (!sb) {
    const config = useRuntimeConfig()
    console.log('Supabase URL:', config.public.supabaseUrl)
    sb = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
  }
  return sb
}

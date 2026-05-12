import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export function useProfile() {
  const loading = ref(false)
  const error = ref(null)

  const getProfile = async (userId) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', userId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw fetchError
      }

      return data || { full_name: '', phone: '' }
    } catch (e) {
      error.value = e.message
      console.error('Error fetching profile:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (userId, updates) => {
    loading.value = true
    error.value = null
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: updates.full_name,
          phone: updates.phone,
          updated_at: new Date().toISOString(),
        })

      if (updateError) throw updateError
      return true
    } catch (e) {
      error.value = e.message
      console.error('Error updating profile:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getProfile,
    updateProfile
  }
}

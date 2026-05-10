import { ref, readonly } from 'vue'
import { supabase } from '../lib/supabase'

const user = ref(null)
const loading = ref(true)

// Update user state on auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null
  loading.value = false
})

export function useAuth() {
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    signUp,
    signIn,
    signOut,
  }
}

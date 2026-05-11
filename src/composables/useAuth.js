import { ref, readonly } from 'vue'
import { supabase } from '../lib/supabase'

const user = ref(null)
const loading = ref(true)
const authEvent = ref(null)

// Update user state on auth changes
supabase.auth.onAuthStateChange((event, session) => {
  user.value = session?.user ?? null
  authEvent.value = event
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

  const resetPasswordForEmail = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?recovery=true`,
    })
    if (error) throw error
    return data
  }

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw error
    return data
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    authEvent: readonly(authEvent),
    signUp,
    signIn,
    signOut,
    resetPasswordForEmail,
    updatePassword
  }
}

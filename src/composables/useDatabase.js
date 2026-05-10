import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export function useDatabase() {
  const loading = ref(false)
  const error = ref(null)

  // Example: Fetch data from a table
  const fetchData = async (table, query = '*') => {
    loading.value = true
    error.value = null
    try {
      const { data, error: dbError } = await supabase
        .from(table)
        .select(query)
      
      if (dbError) throw dbError
      return data
    } catch (err) {
      error.value = err.message
      console.error(`Error fetching from ${table}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Example: Insert data into a table
  const insertData = async (table, record) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: dbError } = await supabase
        .from(table)
        .insert([record])
        .select()
      
      if (dbError) throw dbError
      return data
    } catch (err) {
      error.value = err.message
      console.error(`Error inserting into ${table}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Example: Update data in a table
  const updateData = async (table, id, updates) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: dbError } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
      
      if (dbError) throw dbError
      return data
    } catch (err) {
      error.value = err.message
      console.error(`Error updating ${table}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchData,
    insertData,
    updateData
  }
}

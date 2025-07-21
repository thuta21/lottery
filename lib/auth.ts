import { supabase } from './supabase'

export interface Admin {
  id: string
  username: string
  email: string
  created_at: string
}

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export async function signUpAdmin(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        role: 'admin'
      }
    }
  })
  
  if (error) throw error
  return data
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentAdmin() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
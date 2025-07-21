import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      lottery_tickets: {
        Row: {
          id: string
          ticket_number: string
          draw_id: string
          created_at: string
        }
        Insert: {
          id?: string
          ticket_number: string
          draw_id: string
          created_at?: string
        }
        Update: {
          id?: string
          ticket_number?: string
          draw_id?: string
          created_at?: string
        }
      }
      lottery_draws: {
        Row: {
          id: string
          title: string
          draw_date: string
          created_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          title: string
          draw_date: string
          created_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          title?: string
          draw_date?: string
          created_at?: string
          is_active?: boolean
        }
      }
      admins: {
        Row: {
          id: string
          username: string
          email: string
          password: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password?: string
          created_at?: string
        }
      }
    }
  }
}
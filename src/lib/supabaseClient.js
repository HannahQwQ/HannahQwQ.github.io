import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yeeqmkidpnzevuxbyzjx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZXFta2lkcG56ZXZ1eGJ5emp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjIwMzYsImV4cCI6MjA5MTI5ODAzNn0.i0FKl2QRPNDvQN0eiI1GAVsOfOrnMJxcs0kaAqxkgeA'
// 在 Settings -> API 页面可以找到这两个值

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


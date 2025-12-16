import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores con los de tu proyecto Supabase
const supabaseUrl = 'https://bkvhvhosvqpohqmlonmy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrdmh2aG9zdnFwb2hxbWxvbm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDAyNzcsImV4cCI6MjA3Njk3NjI3N30.CQ7XCrtpnFNo37w6JIMqvosOllKA075zOpL5wRwr1Yg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

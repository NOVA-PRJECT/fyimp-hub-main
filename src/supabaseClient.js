import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://squmsvyctkjrdapuaevv.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdW1zdnljdGtqcmRhcHVhZXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMzk0NzUsImV4cCI6MjA4MTYxNTQ3NX0.S_TcKJgCvEQnmTe3tru4W-mZqDTw8cmoLAZyipg-kfY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

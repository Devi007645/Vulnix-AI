import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ohlvpwpnnsstxsqrcbbm.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9obHZwd3BubnNzdHhzcXJjYmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzE5OTEsImV4cCI6MjA5NDM0Nzk5MX0.a2Q7m-w7Jns1jeueM0K07ti-dLkwsXUkzMAiu9A2GI0';

export const supabase = createClient(supabaseUrl, supabaseKey);

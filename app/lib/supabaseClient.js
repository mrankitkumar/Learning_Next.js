import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://uyxwftnfscpgrkkjrvnc.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eHdmdG5mc2NwZ3Jra2pydm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2MTUxNjksImV4cCI6MjAzODE5MTE2OX0.pkqsFDQKgwy3Q3rHjwqKEHCPT37YUPaJ5Ax7UFz6Nck"
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
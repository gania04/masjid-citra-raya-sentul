import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jqguafbqycdthkgfvlem.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ3VhZmJxeWNkdGhrZ2Z2bGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTcxNDUsImV4cCI6MjEwMDg5MzE0NX0.P_s1srsj0UKzMEHJe1FmzqasWnTsBqIPjafxqi-rfFo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import {createClient, SupabaseClient} from '@supabase/supabase-js'

export const supabase: SupabaseClient = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SUPABASE_PROJECT_ANON_KEY!);
import {createClient, SupabaseClient} from '@supabase/supabase-js'

export const supabase: SupabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!, process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ANON_KEY!);
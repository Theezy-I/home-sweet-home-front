import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://drlnbbodugxkndtpomfa.supabase.co'
const supabaseKey = 'sb_publishable_uxQbUyjsM-DgKapQzvE32Q_ZUNBtdp1'

export const supabase = createClient(supabaseUrl, supabaseKey)
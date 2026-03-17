import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ddsbdslnepxhxmnivcvm.supabase.co';
const supabaseAnonKey = 'sb_publishable_tchzz6SAK3Z9njZTdjGPbg_q549kLSb';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
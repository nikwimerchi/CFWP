import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, NODE_ENV } from "../config";
import { logger } from '../utils/logger';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  logger.error('Missing Supabase Environment Variables');
  process.exit(1);
}


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false, 
  }
});


export const connectToDatabase = async () => {
  try {
    
    const { error } = await supabase.from('_health_check').select('*').limit(1);
    

    logger.info(`Supabase Client initialized for ${NODE_ENV} environment.`);
  } catch (error) {
    logger.error(`Supabase connection failed: ${error.message}`);
  }
};
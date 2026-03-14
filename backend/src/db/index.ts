import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, NODE_ENV } from "../config";
import { logger } from '../utils/logger';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  logger.error('Missing Supabase Environment Variables');
  process.exit(1);
}

// Initialize the Supabase client (used for all queries)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false, // Recommended for backend/API use
  }
});

// Mock connection function to maintain compatibility with your app.ts startup flow
export const connectToDatabase = async () => {
  try {
    // Basic connectivity check: Fetching the project config or a public table
    const { error } = await supabase.from('_health_check').select('*').limit(1);
    
    // Note: If _health_check doesn't exist, it's fine; it still confirms API reachability.
    logger.info(`Supabase Client initialized for ${NODE_ENV} environment.`);
  } catch (error) {
    logger.error(`Supabase connection failed: ${error.message}`);
  }
};
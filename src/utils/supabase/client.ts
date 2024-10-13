// Import the createBrowserClient function from the Supabase SSR package
import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates and configures a Supabase client for browser-side operations
 * 
 * This function initializes a Supabase client using environment variables
 * for the project URL and anonymous API key. It's designed for use in
 * browser environments, as opposed to server-side operations.
 * 
 * @returns {Object} Configured Supabase browser client
 */
export function createClient() {
  // Create and return a Supabase browser client
  // The '!' is used to assert that these environment variables are defined
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

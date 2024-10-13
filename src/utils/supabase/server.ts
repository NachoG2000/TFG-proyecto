// Import necessary dependencies for creating a Supabase server client
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates and configures a Supabase server client
 * @returns {Object} Configured Supabase server client
 */
export function createClient() {
    // Access the cookie store for server-side operations
    const cookieStore = cookies()

    // Create and return a Supabase server client with custom cookie handling
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                // Method to retrieve all cookies
                getAll() {
                    return cookieStore.getAll()
                },
                // Method to set multiple cookies
                setAll(cookiesToSet) {
                    try {
                        // Iterate through the cookies and set each one
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                        })
                    } catch {
                        // Error handling for Server Component context
                        // This catch block is necessary because setAll might be called
                        // from a Server Component where cookie manipulation is not possible
                        // It's safe to ignore if middleware is handling session refreshes
                    }
                }
            },
        }
    )
}

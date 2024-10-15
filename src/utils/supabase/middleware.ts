import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Updates the Supabase session for the given request.
 * This function creates a Supabase client and handles cookie management for authentication.
 * 
 * @param request - The incoming Next.js request object
 * @returns A Promise that resolves to the updated NextResponse object
 */
export async function updateSession(request: NextRequest) {
    // Initialize the response object
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Create a Supabase server client with custom cookie handling
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                // Get all cookies from the request
                getAll() {
                    return request.cookies.getAll()
                },
                // Set cookies on both the request and response objects
                setAll(cookiesToSet) {
                    // Set cookies on the request object
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    
                    // Create a new response object with the updated request
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    
                    // Set cookies on the response object
                    cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
                }
            }
        }
    )

    // Attempt to get the current user's information
    // This call refreshes the session if needed
    await supabase.auth.getUser()

    // Return the response with potentially updated session information
    return supabaseResponse
}

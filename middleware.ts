import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './src/utils/supabase/middleware';
import { createClient } from './src/utils/supabase/server'; // Example of how to get the supabase client to verify the token

export async function middleware(request: NextRequest) {
  // Update the session first, if necessary.
  const sessionResponse = await updateSession(request);

  // If the session is valid, simply return the session response.
  if (sessionResponse.status === 200) {
    // Check if the requested route requires authentication
    const publicPaths = ['/', '/login', '/register'];
    const isPublic = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
    
    if (isPublic) {
      return NextResponse.next();
    }

    // Here we could perform a more specific validation of the user's session.
    const supabase = createClient(); // Assuming you have a way to get an authenticated Supabase client
    const user = await supabase.auth.getUser();

    if (!user) {
      // If there is no authenticated user, redirect to the login page
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return sessionResponse; // Session updated and user authenticated, proceed with the request
  }

  // If `updateSession` fails, the user could be redirected.
  return NextResponse.redirect(new URL('/login', request.url));
}

// Middleware configuration (unchanged)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
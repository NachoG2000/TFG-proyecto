import { createClient } from '@/utils/supabase/client'

export async function handleSignOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export async function handleGoogleSignIn() {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    },
  })
  if (error) {
    console.error('Error signing in with Google:', error)
  }
}

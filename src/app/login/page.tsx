import { redirect } from 'next/navigation'
import LoginContent from './loginContent'
import { createClient } from '@/utils/supabase/client'

export default async function LoginPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return <LoginContent />
}

import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
  
    if (!user) {
      redirect('/login')
    }

  return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar for larger screens */}
          <aside className="hidden md:block w-64 border-r p-4">
            <Sidebar />
          </aside>

          {/* Dynamic main content */}
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
        </div>
      </div>
  )
}
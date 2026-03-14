import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { supabase } from '../lib/supabase'
import logoS from '../assets/img/Logo_S.png'

export default function Home() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/', { replace: true })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/', { replace: true })
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#ffffff' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header
          className="lg:hidden flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid #F9EAEB', background: '#ffffff' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg cursor-pointer hover:bg-[#F9EAEB] transition-colors"
            style={{ color: '#51312C' }}
          >
            <Menu size={22} />
          </button>
          <img src={logoS} alt="Endulzame" className="w-7 h-7 object-contain" />
          <span className="font-bold text-lg tracking-tight" style={{ color: '#51312C' }}>
            Endulzame
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { NavLink, useNavigate } from 'react-router-dom'
import { ClipboardList, LogOut, CalendarDays, X, Store } from 'lucide-react'
import { supabase } from '../lib/supabase'
import logoS from '../assets/img/Logo_S.png'
import background02 from '../assets/img/background/background_02.png'

const navItems = [
  {
    to: '/home/pedidos',
    label: 'Pedidos',
    icon: <ClipboardList size={18} />,
  },
  {
    to: '/home/calendario',
    label: 'Calendario',
    icon: <CalendarDays size={18} />,
  },
  {
    to: '/home/proveedores',
    label: 'Proveedores',
    icon: <Store size={18} />,
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/', { replace: true })
  }

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed lg:relative inset-y-0 left-0 z-40',
          'flex flex-col h-screen w-64 shrink-0 overflow-y-auto',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{
          backgroundImage: `url(${background02})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRight: '1px solid #F9EAEB',
          boxShadow: '1px 0 6px rgba(81,49,44,0.07)',
        }}
      >
        {/* Brand header */}
        <div className="px-6 pt-7 pb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={logoS} alt="Endulzame" className="w-10 h-10 object-contain" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#51312C' }}>
                Endulzame
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#b07a7a' }}>
                Panel de gestión
              </p>
            </div>
          </div>
          {/* Cerrar en mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#F9EAEB] cursor-pointer"
            style={{ color: '#9c5555' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Divider */}
        <div
          className="h-0.5 w-full mb-4 bg-[#d69196]"
          style={{ boxShadow: '0 1px 4px rgba(81,49,44,0.2)' }}
        />

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-1" style={{ color: '#b07a7a' }}>
            Secciones
          </p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive ? 'text-[#FEF5F4]' : 'hover:bg-[#F9EAEB]',
                ].join(' ')
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)',
                      boxShadow: '0 3px 8px rgba(244,121,124,0.30)',
                      color: '#FEF5F4',
                    }
                  : { color: '#51312C' }
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6 pt-4">
          <div
            className="h-0.5 w-full mb-4 bg-[#d69196]"
            style={{ boxShadow: '0 1px 4px rgba(81,49,44,0.2)' }}
          />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all hover:bg-[#F9EAEB] cursor-pointer"
            style={{ color: '#9c5555' }}
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}

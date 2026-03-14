import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import bgTexture from '../assets/img/background/background.png'
import logoEdit from '../assets/img/logo_edit.png'
import texture01 from '../assets/img/background/texture_01.png'
import Footer from '../components/Footer'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/home', { replace: true })
    })
  }, [navigate])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/home', { replace: true })
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between"
      style={{
        backgroundImage: `url(${bgTexture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex-1 flex items-center justify-center w-full py-8 px-4">
      <div
        className="w-full max-w-sm rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        style={{
          background: '#ffffff',
          border: '1px solid #F9EAEB',
          boxShadow: '0 1px 4px rgba(81,49,44,0.12), 0 8px 32px rgba(244,121,124,0.10)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${texture01})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9,
          }}
        />
        {/* Content sobre la textura */}
        <div className="relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <img
            src={logoEdit}
            alt="Endulzame"
            className="mx-auto mb-3 h-36 object-contain"
          />
          <p className="text-sm" style={{ color: '#9c7070' }}>
            Panel de administración
          </p>
        </div>

        {/* Divider */}
        <div
          className="h-0.5 w-full mt-3 mb-6 bg-[#d69196]"
          style={{ boxShadow: '0 1px 4px rgba(81,49,44,0.2)' }}
        />

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: '#51312C' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid #F9EAEB',
                color: '#51312C',
                boxShadow: 'inset 0 1px 3px rgba(81,49,44,0.08)',
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: '#51312C' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid #F9EAEB',
                color: '#51312C',
                boxShadow: 'inset 0 1px 3px rgba(81,49,44,0.08)',
              }}
            />
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: '#e05060' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold mt-2 cursor-pointer disabled:opacity-60 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)',
              border: '1px solid #FA9B99',
              color: '#FEF5F4',
              textShadow: '0 0 2px rgba(0,0,0,0.15)',
              boxShadow: '0 3px 8px rgba(244,121,124,0.35)',
            }}
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}

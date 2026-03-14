import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { supabase, type Pedido } from '../lib/supabase'

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function toLocalDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function CalendarioPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [pedidos, setPedidos] = useState<Pick<Pedido, 'id' | 'nombre' | 'fecha_entrega' | 'estado'>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const { data } = await supabase
        .from('pedidos')
        .select('id, nombre, fecha_entrega, estado')
        .order('fecha_entrega', { ascending: true })
      setPedidos(data ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const todayStr = toLocalDateStr(today)

  // Días del mes actual que tienen entregas
  const deliveryDays = new Set(
    pedidos
      .filter(p => {
        const [y, m] = p.fecha_entrega.split('-').map(Number)
        return y === year && m === month + 1
      })
      .map(p => p.fecha_entrega)
  )

  // Pedidos a mostrar en la tabla según selección
  const tablePedidos = selectedDay
    ? pedidos.filter(p => p.fecha_entrega === selectedDay)
    : pedidos.filter(p => {
        const [y, m] = p.fecha_entrega.split('-').map(Number)
        return y === year && m === month + 1
      })

  // Contar entregas por día para el badge
  const countByDay: Record<string, number> = {}
  pedidos.forEach(p => {
    countByDay[p.fecha_entrega] = (countByDay[p.fecha_entrega] ?? 0) + 1
  })

  function formatFecha(dateStr: string) {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  // Celdas del calendario (blancos + días del mes)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Completar hasta múltiplo de 7
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="w-full">
      {/* Header banner */}
      <div
        className="rounded-2xl px-5 py-5 sm:px-8 sm:py-6 mb-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)',
          border: '1px solid #FA9B99',
          boxShadow: '0 3px 12px rgba(244,121,124,0.30)',
        }}
      >
        <div className="relative z-10 flex items-center gap-3">
          <CalendarDays size={28} style={{ color: 'rgba(254,245,244,0.85)' }} />
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#FEF5F4', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              Calendario
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(254,245,244,0.8)' }}>
              Fechas de entrega de pedidos
            </p>
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 items-start">

        {/* ── Columna 1: Calendario ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#ffffff',
            border: '1px solid #F9EAEB',
            boxShadow: '0 1px 4px rgba(81,49,44,0.08)',
          }}
        >
          {/* Nav mes */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid #F9EAEB' }}
          >
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-[#F9EAEB] cursor-pointer transition-colors"
              style={{ color: '#9c5555' }}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-bold text-base tracking-wide" style={{ color: '#51312C' }}>
              {MESES[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-[#F9EAEB] cursor-pointer transition-colors"
              style={{ color: '#9c5555' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Días de semana */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {DIAS.map(d => (
              <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wider py-1" style={{ color: '#b07a7a' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Grilla días */}
          <div className="grid grid-cols-7 px-3 pb-4 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isToday = dateStr === todayStr
              const isSelected = dateStr === selectedDay
              const hasDelivery = deliveryDays.has(dateStr)
              const count = countByDay[dateStr] ?? 0

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                  className="relative flex flex-col items-center justify-center rounded-xl py-1.5 cursor-pointer transition-all text-sm font-medium"
                  style={
                    isSelected
                      ? {
                          background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)',
                          color: '#FEF5F4',
                          boxShadow: '0 3px 8px rgba(244,121,124,0.35)',
                        }
                      : isToday
                      ? {
                          background: 'rgba(244,121,124,0.12)',
                          color: '#F4797C',
                          border: '1px solid rgba(244,121,124,0.3)',
                        }
                      : {
                          color: '#51312C',
                        }
                  }
                >
                  <span>{day}</span>
                  {hasDelivery && (
                    <span
                      className="text-[9px] font-bold leading-none mt-0.5"
                      style={{ color: isSelected ? 'rgba(254,245,244,0.85)' : '#F4797C' }}
                    >
                      {count > 1 ? `${count}` : '●'}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Leyenda */}
          <div
            className="flex items-center gap-4 px-5 py-3 text-xs"
            style={{ borderTop: '1px solid #F9EAEB', color: '#b07a7a' }}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: '#F4797C' }} />
              Entrega
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-lg border" style={{ background: 'rgba(244,121,124,0.12)', borderColor: 'rgba(244,121,124,0.3)' }} />
              Hoy
            </span>
          </div>
        </div>

        {/* ── Columna 2: Tabla ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1px solid #F9EAEB',
            boxShadow: '0 1px 4px rgba(81,49,44,0.08)',
          }}
        >
          {/* Tabla header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{
              background: '#ffffff',
              borderBottom: '1px solid #F9EAEB',
            }}
          >
            <div>
              <p className="font-bold text-sm" style={{ color: '#51312C' }}>
                {selectedDay ? `Entregas del ${formatFecha(selectedDay)}` : `Entregas de ${MESES[month]}`}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#b07a7a' }}>
                {tablePedidos.length} pedido{tablePedidos.length !== 1 ? 's' : ''}
              </p>
            </div>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="text-xs px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#F9EAEB] transition-colors"
                style={{ color: '#9c5555', border: '1px solid #F9EAEB' }}
              >
                Ver todo el mes
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-16" style={{ background: '#ffffff' }}>
              <div className="w-7 h-7 rounded-full border-2 animate-spin"
                style={{ borderColor: '#F4797C', borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)' }}>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#FEF5F4' }}>
                    Fecha entrega
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#FEF5F4' }}>
                    Cliente
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#FEF5F4' }}>
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {tablePedidos.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12" style={{ background: '#ffffff', color: '#b07a7a' }}>
                      No hay entregas para este período.
                    </td>
                  </tr>
                ) : (
                  tablePedidos.map((p, i) => (
                    <tr
                      key={p.id}
                      style={{
                        background: i % 2 === 0 ? '#ffffff' : '#fafafa',
                        borderBottom: '1px solid #F9EAEB',
                      }}
                    >
                      <td className="px-5 py-3 font-medium whitespace-nowrap" style={{ color: '#51312C' }}>
                        {formatFecha(p.fecha_entrega)}
                      </td>
                      <td className="px-5 py-3" style={{ color: '#51312C' }}>
                        {p.nombre}
                      </td>
                      <td className="px-5 py-3">
                        {(() => {
                          const styles: Record<string, { bg: string; color: string; border: string }> = {
                            pendiente:    { bg: '#FFF8E1', color: '#8a6200', border: '#FFE082' },
                            'en proceso': { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' },
                            listo:        { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
                            entregado:    { bg: '#F3E5F5', color: '#6A1B9A', border: '#CE93D8' },
                          }
                          const s = styles[p.estado ?? ''] ?? { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' }
                          return (
                            <span
                              className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                              style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                            >
                              {p.estado ?? 'pendiente'}
                            </span>
                          )
                        })()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

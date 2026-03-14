import { useEffect, useState } from 'react'
import { Pencil, X, ChevronDown, Eye, ClipboardList } from 'lucide-react'
import { supabase, type Pedido } from '../lib/supabase'

const ESTADOS = ['pendiente', 'en proceso', 'listo', 'entregado']
const ESTADOS_FILTER = ['todos', ...ESTADOS]

const estadoStyle: Record<string, { bg: string; color: string; border: string }> = {
  pendiente:    { bg: '#FFF8E1', color: '#8a6200', border: '#FFE082' },
  'en proceso': { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' },
  listo:        { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
  entregado:    { bg: '#F3E5F5', color: '#6A1B9A', border: '#CE93D8' },
}

function EstadoBadge({ estado, onClick }: { estado: string | null; onClick?: () => void }) {
  const s = estadoStyle[estado ?? ''] ?? { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' }
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-opacity hover:opacity-75 cursor-pointer"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {estado ?? 'pendiente'}
      <ChevronDown size={11} />
    </button>
  )
}

// ── Estado Modal ─────────────────────────────────────────────────────────────
function EstadoModal({
  pedido,
  onClose,
  onSave,
}: {
  pedido: Pedido
  onClose: () => void
  onSave: (id: string, estado: string) => Promise<void>
}) {
  const [selected, setSelected] = useState(pedido.estado ?? 'pendiente')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave(pedido.id, selected)
    setSaving(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(81,49,44,0.25)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-2xl p-6"
        style={{
          background: '#ffffff',
          border: '1px solid #F9EAEB',
          boxShadow: '0 8px 32px rgba(81,49,44,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base" style={{ color: '#51312C' }}>Cambiar estado</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F9EAEB] cursor-pointer" style={{ color: '#9c5555' }}>
            <X size={16} />
          </button>
        </div>
        <p className="text-xs mb-4" style={{ color: '#b07a7a' }}>Pedido de <strong style={{ color: '#51312C' }}>{pedido.nombre}</strong></p>

        <div className="h-0.5 w-full mb-4 bg-[#d69196]" style={{ boxShadow: '0 1px 4px rgba(81,49,44,0.2)' }} />

        <div className="flex flex-col gap-2 mb-5">
          {ESTADOS.map(e => {
            const s = estadoStyle[e]
            const isSelected = selected === e
            return (
              <button
                key={e}
                onClick={() => setSelected(e)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                style={
                  isSelected
                    ? {
                        background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)',
                        border: '1px solid #FA9B99',
                        color: '#FEF5F4',
                        boxShadow: '0 3px 8px rgba(244,121,124,0.30)',
                      }
                    : {
                        background: s.bg,
                        border: `1px solid ${s.border}`,
                        color: s.color,
                      }
                }
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: isSelected ? '#FEF5F4' : s.color }}
                />
                <span className="capitalize">{e}</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleSave}
          disabled={saving || selected === (pedido.estado ?? 'pendiente')}
          className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold cursor-pointer disabled:opacity-50 transition-opacity"
          style={{
            background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)',
            border: '1px solid #FA9B99',
            color: '#FEF5F4',
            boxShadow: '0 3px 8px rgba(244,121,124,0.30)',
          }}
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}

// ── View Modal ────────────────────────────────────────────────────────────────
function InfoField({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#b07a7a' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: '#51312C' }}>{value}</span>
    </div>
  )
}

function ViewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#b07a7a' }}>{title}</p>
        <div className="h-0.5 w-full mt-1 bg-[#d69196]" style={{ boxShadow: '0 1px 4px rgba(81,49,44,0.2)' }} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
        {children}
      </div>
    </div>
  )
}

function ViewModal({ pedido, onClose }: { pedido: Pedido; onClose: () => void }) {
  const hasAgregados = pedido.agregado_1 || pedido.agregado_2 || pedido.agregado_3
  const hasExtras = pedido.cookies || pedido.oreos || pedido.cupcakes || pedido.alfajores || pedido.popcakes || pedido.icepops
  const hasMultipisos = pedido.bizcochuelo_piso2 || pedido.bizcochuelo_piso3

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(81,49,44,0.25)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: '#ffffff',
          border: '1px solid #F9EAEB',
          boxShadow: '0 8px 32px rgba(81,49,44,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div
          className="sticky top-0 flex items-center justify-between px-6 py-4 rounded-t-2xl z-10"
          style={{
            background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)',
          }}
        >
          <div>
            <h3 className="font-bold text-lg leading-tight" style={{ color: '#FEF5F4' }}>
              {pedido.nombre}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(254,245,244,0.75)' }}>
              {pedido.tipo_seccion}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <EstadoBadge estado={pedido.estado} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg cursor-pointer transition-colors"
              style={{ color: '#FEF5F4', background: 'rgba(255,255,255,0.15)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6">
          {/* Cliente */}
          <ViewSection title="Cliente">
            <InfoField label="Nombre" value={pedido.nombre} />
            <InfoField label="Teléfono" value={pedido.telefono} />
            <InfoField label="Email" value={pedido.email} />
          </ViewSection>

          {/* Pedido */}
          <ViewSection title="Pedido">
                        <InfoField label="Registro de pedido" value={
              pedido.created_at
                ? new Date(pedido.created_at).toLocaleDateString('es-AR', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })
                : undefined
            } />
            <InfoField label="Fecha entrega" value={
              new Date(pedido.fecha_entrega + 'T00:00:00').toLocaleDateString('es-AR', {
                day: '2-digit', month: 'long', year: 'numeric',
              })
            } />
            
            

          </ViewSection>

          {/* Torta */}
          <ViewSection title="Torta">
            <InfoField label="Porciones" value={pedido.porciones} />
            <InfoField label="Tipo torta" value={pedido.tipo_torta} />
            <InfoField label="Bizcochuelo" value={pedido.bizcochuelo} />
            {hasMultipisos && (
              <>
                <InfoField label="Bizcochuelo piso 2" value={pedido.bizcochuelo_piso2} />
                <InfoField label="Bizcochuelo piso 3" value={pedido.bizcochuelo_piso3} />
              </>
            )}
            <InfoField label="Relleno" value={pedido.relleno} />
            <InfoField label="Relleno 2" value={pedido.relleno_2} />

          </ViewSection>

          {/* Agregados */}
          {hasAgregados && (
            <ViewSection title="Agregados">
              <InfoField label="Agregado 1" value={pedido.agregado_1} />
              <InfoField label="Agregado 2" value={pedido.agregado_2} />
              <InfoField label="Agregado 3" value={pedido.agregado_3} />
            </ViewSection>
          )}

          {/* Extras */}
          {hasExtras && (
            <ViewSection title="Extras">
              <InfoField label="Cookies" value={pedido.cookies} />
              <InfoField label="Oreos" value={pedido.oreos} />
              <InfoField label="Cupcakes" value={pedido.cupcakes} />
              <InfoField label="Alfajores" value={pedido.alfajores} />
              <InfoField label="Popcakes" value={pedido.popcakes} />
              <InfoField label="Ice pops" value={pedido.icepops} />
            </ViewSection>
          )}

          {/* Foto */}
          {pedido.foto && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#b07a7a' }}>Foto de referencia</p>
              <div className="h-0.5 w-full bg-[#d69196]" style={{ boxShadow: '0 1px 4px rgba(81,49,44,0.2)' }} />
              <a
                href={pedido.foto}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: '#F4797C' }}
              >
                <Eye size={14} />
                Ver foto
              </a>
            </div>
          )}

          {/* Info extra */}
          {pedido.info_extra && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#b07a7a' }}>Info extra</p>
              <div className="h-0.5 w-full bg-[#d69196]" style={{ boxShadow: '0 1px 4px rgba(81,49,44,0.2)' }} />
              <p className="text-sm" style={{ color: '#51312C' }}>{pedido.info_extra}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
type EditData = Omit<Pedido, 'id' | 'created_at'>

function FieldInput({
  label,
  name,
  value,
  onChange,
  required,
  type = 'text',
}: {
  label: string
  name: keyof EditData
  value: string
  onChange: (name: keyof EditData, value: string) => void
  required?: boolean
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: '#b07a7a' }}>
        {label}{required && <span style={{ color: '#F4797C' }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        className="rounded-lg px-3 py-2 text-sm outline-none"
        style={{
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid #F9EAEB',
          color: '#51312C',
          boxShadow: 'inset 0 1px 3px rgba(81,49,44,0.06)',
        }}
      />
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-widest mt-2" style={{ color: '#b07a7a' }}>{children}</p>
      <div className="h-0.5 w-full bg-[#d69196]" style={{ boxShadow: '0 1px 4px rgba(81,49,44,0.2)' }} />
    </>
  )
}

function EditModal({
  pedido,
  onClose,
  onSave,
}: {
  pedido: Pedido
  onClose: () => void
  onSave: (id: string, data: Partial<Pedido>) => Promise<void>
}) {
  const [form, setForm] = useState<EditData>({
    tipo_seccion: pedido.tipo_seccion,
    estado: pedido.estado,
    nombre: pedido.nombre,
    telefono: pedido.telefono,
    email: pedido.email,
    fecha_entrega: pedido.fecha_entrega,
    tipo_torta: pedido.tipo_torta,
    porciones: pedido.porciones,
    bizcochuelo: pedido.bizcochuelo,
    relleno: pedido.relleno,
    relleno_2: pedido.relleno_2 ?? '',
    foto: pedido.foto,
    info_extra: pedido.info_extra ?? '',
    bizcochuelo_piso2: pedido.bizcochuelo_piso2 ?? '',
    bizcochuelo_piso3: pedido.bizcochuelo_piso3 ?? '',
    agregado_1: pedido.agregado_1 ?? '',
    agregado_2: pedido.agregado_2 ?? '',
    agregado_3: pedido.agregado_3 ?? '',
    cookies: pedido.cookies ?? '',
    oreos: pedido.oreos ?? '',
    cupcakes: pedido.cupcakes ?? '',
    alfajores: pedido.alfajores ?? '',
    popcakes: pedido.popcakes ?? '',
    icepops: pedido.icepops ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(name: keyof EditData, value: string) {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    // Send null for empty optional fields
    const clean = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
    ) as Partial<Pedido>
    await onSave(pedido.id, clean)
    setSaving(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(81,49,44,0.25)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{
          background: '#ffffff',
          border: '1px solid #F9EAEB',
          boxShadow: '0 8px 32px rgba(81,49,44,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg" style={{ color: '#51312C' }}>Editar pedido</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F9EAEB] cursor-pointer" style={{ color: '#9c5555' }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <SectionTitle>Cliente</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FieldInput label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
            <FieldInput label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} required />
            <FieldInput label="Email" name="email" value={form.email} onChange={handleChange} required type="email" />
          </div>

          <SectionTitle>Pedido</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FieldInput label="Fecha entrega" name="fecha_entrega" value={form.fecha_entrega} onChange={handleChange} required type="date" />
            
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
           
          </div>

          <SectionTitle>Torta</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FieldInput label="Tipo torta" name="tipo_torta" value={form.tipo_torta} onChange={handleChange} required />
             <FieldInput label="Categoria de torta" name="tipo_seccion" value={form.tipo_seccion} onChange={handleChange} />
            <FieldInput label="Porciones" name="porciones" value={form.porciones} onChange={handleChange} required />
            <FieldInput label="Bizcochuelo" name="bizcochuelo" value={form.bizcochuelo} onChange={handleChange} required />
            <FieldInput label="Relleno" name="relleno" value={form.relleno} onChange={handleChange} required />
            <FieldInput label="Relleno 2" name="relleno_2" value={form.relleno_2 ?? ''} onChange={handleChange} />
            <FieldInput label="Bizcochuelo piso 2" name="bizcochuelo_piso2" value={form.bizcochuelo_piso2 ?? ''} onChange={handleChange} />
            <FieldInput label="Bizcochuelo piso 3" name="bizcochuelo_piso3" value={form.bizcochuelo_piso3 ?? ''} onChange={handleChange} />
                      <FieldInput label="Foto (URL)" name="foto" value={form.foto} onChange={handleChange} required />
</div>

          <SectionTitle>Agregados</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FieldInput label="Agregado 1" name="agregado_1" value={form.agregado_1 ?? ''} onChange={handleChange} />
            <FieldInput label="Agregado 2" name="agregado_2" value={form.agregado_2 ?? ''} onChange={handleChange} />
            <FieldInput label="Agregado 3" name="agregado_3" value={form.agregado_3 ?? ''} onChange={handleChange} />
          </div>

          <SectionTitle>Extras</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <FieldInput label="Cookies" name="cookies" value={form.cookies ?? ''} onChange={handleChange} />
            <FieldInput label="Oreos" name="oreos" value={form.oreos ?? ''} onChange={handleChange} />
            <FieldInput label="Cupcakes" name="cupcakes" value={form.cupcakes ?? ''} onChange={handleChange} />
            <FieldInput label="Alfajores" name="alfajores" value={form.alfajores ?? ''} onChange={handleChange} />
            <FieldInput label="Popcakes" name="popcakes" value={form.popcakes ?? ''} onChange={handleChange} />
            <FieldInput label="Ice pops" name="icepops" value={form.icepops ?? ''} onChange={handleChange} />
          </div>

          <SectionTitle>Info extra</SectionTitle>
          
          <div>
            <textarea
              value={form.info_extra ?? ''}
              onChange={e => handleChange('info_extra', e.target.value)}
              rows={3}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid #F9EAEB',
                color: '#51312C',
                boxShadow: 'inset 0 1px 3px rgba(81,49,44,0.06)',
              }}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm mt-3" style={{ color: '#e05060' }}>{error}</p>
        )}

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer hover:bg-[#F9EAEB] transition-colors"
            style={{ color: '#9c5555', border: '1px solid #F9EAEB' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)',
              border: '1px solid #FA9B99',
              color: '#FEF5F4',
              boxShadow: '0 3px 8px rgba(244,121,124,0.30)',
            }}
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [estadoModal, setEstadoModal] = useState<Pedido | null>(null)
  const [editModal, setEditModal] = useState<Pedido | null>(null)
  const [viewModal, setViewModal] = useState<Pedido | null>(null)

  useEffect(() => {
    async function fetchPedidos() {
      setLoading(true)
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) setError(error.message)
      else setPedidos(data ?? [])
      setLoading(false)
    }
    fetchPedidos()
  }, [])

  async function handleEstadoSave(id: string, estado: string) {
    const { error } = await supabase.from('pedidos').update({ estado }).eq('id', id)
    if (!error) {
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
    }
  }

  async function handleEditSave(id: string, data: Partial<Pedido>) {
    const { error } = await supabase.from('pedidos').update(data).eq('id', id)
    if (!error) {
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    }
  }

  const filtrados =
    filtroEstado === 'todos'
      ? pedidos
      : pedidos.filter(p => (p.estado ?? 'pendiente') === filtroEstado)

  function formatDate(dateStr: string) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  function formatDateTime(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="w-full">
      {/* Header banner */}
      <div
        className="rounded-2xl px-8 py-6 mb-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)',
          border: '1px solid #FA9B99',
          boxShadow: '0 3px 12px rgba(244,121,124,0.30)',
        }}
      >
        <div className="relative z-10 flex items-center gap-3">
          <ClipboardList size={28} style={{ color: 'rgba(254,245,244,0.85)' }} />
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#FEF5F4', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              Pedidos
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(254,245,244,0.8)' }}>
              {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} en total
            </p>
          </div>
        </div>
      </div>

      <div className="h-0.5 w-full mb-5 bg-[#d69196]" style={{ boxShadow: '0 1px 4px rgba(81,49,44,0.2)' }} />

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-5">
        {ESTADOS_FILTER.map(e => (
          <button
            key={e}
            onClick={() => setFiltroEstado(e)}
            className="px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all cursor-pointer"
            style={
              filtroEstado === e
                ? {
                    background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)',
                    color: '#FEF5F4',
                    border: '1px solid #FA9B99',
                    boxShadow: '0 3px 8px rgba(244,121,124,0.30)',
                  }
                : {
                    background: 'rgba(255,255,255,0.6)',
                    color: '#51312C',
                    border: '1px solid #F9EAEB',
                  }
            }
          >
            {e}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: '#F4797C', borderTopColor: 'transparent' }} />
        </div>
      )}

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm"
          style={{ background: '#FEE2E2', color: '#b91c1c', border: '1px solid #FECACA' }}>
          Error al cargar pedidos: {error}
        </div>
      )}

      {!loading && !error && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid #F9EAEB', boxShadow: '0 1px 4px rgba(81,49,44,0.08)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)' }}>
                  {['Fecha pedido', 'Nombre', 'Fecha entrega', 'Tipo torta', 'Porciones', 'Categoria', 'Estado', 'Acciones'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                      style={{ color: '#FEF5F4' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12" style={{ color: '#b07a7a', background: '#ffffff' }}>
                      No hay pedidos {filtroEstado !== 'todos' ? `con estado "${filtroEstado}"` : ''}.
                    </td>
                  </tr>
                )}
                {filtrados.map((pedido, i) => (
                  <tr
                    key={pedido.id}
                    style={{
                      background: i % 2 === 0 ? '#ffffff' : '#fafafa',
                      borderBottom: '1px solid #F9EAEB',
                    }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#9c7070' }}>
                      {pedido.created_at ? formatDateTime(pedido.created_at) : '—'}
                    </td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: '#51312C' }}>
                      {pedido.nombre}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#51312C' }}>
                      {formatDate(pedido.fecha_entrega)}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#51312C', maxWidth: 160 }}>
                      <span className="block truncate">{pedido.tipo_torta}</span>
                    </td>
                    <td className="px-4 py-3 text-center" style={{ color: '#51312C' }}>
                      {pedido.porciones}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#9c7070' }}>
                      {pedido.tipo_seccion}
                    </td>
                    <td className="px-4 py-3">
                      <EstadoBadge
                        estado={pedido.estado}
                        onClick={() => setEstadoModal(pedido)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewModal(pedido)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80"
                          style={{
                            background: 'rgba(255,255,255,0.7)',
                            border: '1px solid #F9EAEB',
                            color: '#51312C',
                            boxShadow: '0 1px 3px rgba(81,49,44,0.08)',
                          }}
                        >
                          <Eye size={12} />
                          Ver
                        </button>
                        <button
                          onClick={() => setEditModal(pedido)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80"
                          style={{
                            background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)',
                            border: '1px solid #FA9B99',
                            color: '#FEF5F4',
                            boxShadow: '0 2px 6px rgba(244,121,124,0.25)',
                          }}
                        >
                          <Pencil size={12} />
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {estadoModal && (
        <EstadoModal
          pedido={estadoModal}
          onClose={() => setEstadoModal(null)}
          onSave={handleEstadoSave}
        />
      )}
      {editModal && (
        <EditModal
          pedido={editModal}
          onClose={() => setEditModal(null)}
          onSave={handleEditSave}
        />
      )}
      {viewModal && (
        <ViewModal
          pedido={viewModal}
          onClose={() => setViewModal(null)}
        />
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Pencil, X, Eye, Star, Trash2, Store, Plus, MessageCircle } from 'lucide-react'
import { supabase, type Proveedor } from '../lib/supabase'


// ── Ranking Badge ─────────────────────────────────────────────────────────────
function RankingBadge({ ranking }: { ranking: number }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={14}
          fill={n <= ranking ? '#F4797C' : 'none'}
          style={{ color: n <= ranking ? '#F4797C' : '#d69196' }}
        />
      ))}
    </div>
  )
}

// ── WhatsApp Link ─────────────────────────────────────────────────────────────
function WhatsAppLink({ numero }: { numero: string }) {
  const clean = numero.replace(/\D/g, '')
  return (
    <a
      href={`https://wa.me/${clean}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-medium transition-opacity hover:opacity-70"
      style={{ color: '#25D366' }}
    >
      <MessageCircle size={14} />
      {numero}
    </a>
  )
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({
  proveedor,
  onClose,
  onConfirm,
}: {
  proveedor: Proveedor
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await onConfirm(proveedor.id)
    setDeleting(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(81,49,44,0.25)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: '#ffffff',
          border: '1px solid #F9EAEB',
          boxShadow: '0 8px 32px rgba(81,49,44,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base" style={{ color: '#51312C' }}>Eliminar proveedor</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F9EAEB] cursor-pointer" style={{ color: '#9c5555' }}>
            <X size={16} />
          </button>
        </div>

        <div className="h-0.5 w-full mb-4 bg-[#d69196]" style={{ boxShadow: '0 1px 4px rgba(81,49,44,0.2)' }} />

        <p className="text-sm mb-5" style={{ color: '#51312C' }}>
          ¿Estás seguro que querés eliminar a{' '}
          <strong>{proveedor.nombre_proveedor}</strong>? Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer hover:bg-[#F9EAEB] transition-colors"
            style={{ color: '#9c5555', border: '1px solid #F9EAEB' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #e05060 0%, #c0392b 100%)',
              border: '1px solid #e07070',
              color: '#FEF5F4',
              boxShadow: '0 3px 8px rgba(224,80,96,0.30)',
            }}
          >
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
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

function ViewModal({ proveedor, onClose }: { proveedor: Proveedor; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(81,49,44,0.25)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl"
        style={{
          background: '#ffffff',
          border: '1px solid #F9EAEB',
          boxShadow: '0 8px 32px rgba(81,49,44,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div
          className="sticky top-0 flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)' }}
        >
          <div>
            <h3 className="font-bold text-lg leading-tight" style={{ color: '#FEF5F4' }}>
              {proveedor.nombre_proveedor}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(254,245,244,0.75)' }}>
              {proveedor.categoria}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg cursor-pointer transition-colors"
            style={{ color: '#FEF5F4', background: 'rgba(255,255,255,0.15)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <ViewSection title="Información">
            <InfoField label="Nombre" value={proveedor.nombre_proveedor} />
            <InfoField label="Categoría" value={proveedor.categoria} />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#b07a7a' }}>Número de contacto</span>
              <WhatsAppLink numero={proveedor.numero_de_contacto} />
            </div>
            <InfoField
              label="Fecha de registro"
              value={
                proveedor.created_at
                  ? new Date(proveedor.created_at).toLocaleDateString('es-AR', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })
                  : undefined
              }
            />
          </ViewSection>

          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#b07a7a' }}>Ranking</p>
            <div className="h-0.5 w-full bg-[#d69196]" style={{ boxShadow: '0 1px 4px rgba(81,49,44,0.2)' }} />
            <div className="flex items-center gap-2">
              <RankingBadge ranking={proveedor.ranking} />
              <span className="text-sm font-medium" style={{ color: '#51312C' }}>{proveedor.ranking} / 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
type EditData = Omit<Proveedor, 'id' | 'created_at'>

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
  proveedor,
  onClose,
  onSave,
}: {
  proveedor: Proveedor
  onClose: () => void
  onSave: (id: string, data: Partial<Proveedor>) => Promise<void>
}) {
  const [form, setForm] = useState<EditData>({
    nombre_proveedor: proveedor.nombre_proveedor,
    categoria: proveedor.categoria,
    numero_de_contacto: proveedor.numero_de_contacto,
    ranking: proveedor.ranking,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(name: keyof EditData, value: string) {
    setForm(prev => ({
      ...prev,
      [name]: name === 'ranking' ? Number(value) : value,
    }))
  }

  async function handleSave() {
    if (!form.nombre_proveedor || !form.categoria || !form.numero_de_contacto) {
      setError('Completá los campos obligatorios.')
      return
    }
    setSaving(true)
    setError(null)
    await onSave(proveedor.id, form)
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
        className="w-full max-w-lg rounded-2xl p-6"
        style={{
          background: '#ffffff',
          border: '1px solid #F9EAEB',
          boxShadow: '0 8px 32px rgba(81,49,44,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg" style={{ color: '#51312C' }}>Editar proveedor</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F9EAEB] cursor-pointer" style={{ color: '#9c5555' }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <SectionTitle>Datos del proveedor</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FieldInput label="Nombre del proveedor" name="nombre_proveedor" value={form.nombre_proveedor} onChange={handleChange} required />
            <FieldInput label="Categoría" name="categoria" value={form.categoria} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FieldInput label="Número de contacto" name="numero_de_contacto" value={form.numero_de_contacto} onChange={handleChange} required />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#b07a7a' }}>
                Ranking <span style={{ color: '#F4797C' }}>*</span>
              </label>
              <select
                value={form.ranking}
                onChange={e => handleChange('ranking', e.target.value)}
                className="rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid #F9EAEB',
                  color: '#51312C',
                  boxShadow: 'inset 0 1px 3px rgba(81,49,44,0.06)',
                }}
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} estrella{n !== 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
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

// ── Create Modal ─────────────────────────────────────────────────────────────
type CreateData = Omit<Proveedor, 'id' | 'created_at'>

const EMPTY_FORM: CreateData = {
  nombre_proveedor: '',
  categoria: '',
  numero_de_contacto: '',
  ranking: 3,
}

function CreateModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (data: CreateData) => Promise<void>
}) {
  const [form, setForm] = useState<CreateData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(name: keyof CreateData, value: string) {
    setForm(prev => ({
      ...prev,
      [name]: name === 'ranking' ? Number(value) : value,
    }))
  }

  async function handleSave() {
    if (!form.nombre_proveedor || !form.categoria || !form.numero_de_contacto) {
      setError('Completá los campos obligatorios.')
      return
    }
    setSaving(true)
    setError(null)
    await onSave(form)
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
        className="w-full max-w-lg rounded-2xl p-6"
        style={{
          background: '#ffffff',
          border: '1px solid #F9EAEB',
          boxShadow: '0 8px 32px rgba(81,49,44,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg" style={{ color: '#51312C' }}>Nuevo proveedor</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F9EAEB] cursor-pointer" style={{ color: '#9c5555' }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <SectionTitle>Datos del proveedor</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FieldInput label="Nombre del proveedor" name="nombre_proveedor" value={form.nombre_proveedor} onChange={handleChange} required />
            <FieldInput label="Categoría" name="categoria" value={form.categoria} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FieldInput label="Número de contacto" name="numero_de_contacto" value={form.numero_de_contacto} onChange={handleChange} required />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#b07a7a' }}>
                Ranking <span style={{ color: '#F4797C' }}>*</span>
              </label>
              <select
                value={form.ranking}
                onChange={e => handleChange('ranking', e.target.value)}
                className="rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid #F9EAEB',
                  color: '#51312C',
                  boxShadow: 'inset 0 1px 3px rgba(81,49,44,0.06)',
                }}
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} estrella{n !== 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
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
            {saving ? 'Guardando…' : 'Crear proveedor'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Proveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [viewModal, setViewModal] = useState<Proveedor | null>(null)
  const [editModal, setEditModal] = useState<Proveedor | null>(null)
  const [deleteModal, setDeleteModal] = useState<Proveedor | null>(null)
  const [createModal, setCreateModal] = useState(false)

  useEffect(() => {
    async function fetchProveedores() {
      setLoading(true)
      const { data, error } = await supabase
        .from('proveedores')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) setError(error.message)
      else setProveedores(data ?? [])
      setLoading(false)
    }
    fetchProveedores()
  }, [])

  async function handleEditSave(id: string, data: Partial<Proveedor>) {
    const { error } = await supabase.from('proveedores').update(data).eq('id', id)
    if (!error) {
      setProveedores(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    }
  }

  async function handleCreate(data: CreateData) {
    const { data: inserted, error } = await supabase
      .from('proveedores')
      .insert(data)
      .select()
      .single()
    if (!error && inserted) {
      setProveedores(prev => [inserted, ...prev])
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('proveedores').delete().eq('id', id)
    if (!error) {
      setProveedores(prev => prev.filter(p => p.id !== id))
    }
  }

  const filtrados =
    filtroCategoria === 'todas'
      ? proveedores
      : proveedores.filter(p => p.categoria.toLowerCase() === filtroCategoria)

  // Build dynamic category list from data + defaults
  const categoriasDisponibles = [
    'todas',
    ...Array.from(new Set(proveedores.map(p => p.categoria.toLowerCase()))).sort(),
  ]

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
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Store size={28} style={{ color: 'rgba(254,245,244,0.85)' }} />
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#FEF5F4', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Proveedores
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(254,245,244,0.8)' }}>
                {proveedores.length} proveedor{proveedores.length !== 1 ? 'es' : ''} en total
              </p>
            </div>
          </div>
          <button
            onClick={() => setCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-opacity hover:opacity-85"
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.35)',
              color: '#FEF5F4',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Plus size={16} />
            Nuevo proveedor
          </button>
        </div>
      </div>

      <div className="h-0.5 w-full mb-5 bg-[#d69196]" style={{ boxShadow: '0 1px 4px rgba(81,49,44,0.2)' }} />

      {/* Filtros por categoría */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categoriasDisponibles.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltroCategoria(cat)}
            className="px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all cursor-pointer"
            style={
              filtroCategoria === cat
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
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: '#F4797C', borderTopColor: 'transparent' }} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm"
          style={{ background: '#FEE2E2', color: '#b91c1c', border: '1px solid #FECACA' }}>
          Error al cargar proveedores: {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid #F9EAEB', boxShadow: '0 1px 4px rgba(81,49,44,0.08)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #F4797C 0%, #F27F7F 100%)' }}>
                  {['Nombre del proveedor', 'Categoría', 'Número de contacto', 'Ranking', 'Acciones'].map(h => (
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
                    <td colSpan={5} className="text-center py-12" style={{ color: '#b07a7a', background: '#ffffff' }}>
                      No hay proveedores{filtroCategoria !== 'todas' ? ` en la categoría "${filtroCategoria}"` : ''}.
                    </td>
                  </tr>
                )}
                {filtrados.map((proveedor, i) => (
                  <tr
                    key={proveedor.id}
                    style={{
                      background: i % 2 === 0 ? '#ffffff' : '#fafafa',
                      borderBottom: '1px solid #F9EAEB',
                    }}
                  >
                    <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: '#51312C' }}>
                      {proveedor.nombre_proveedor}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap capitalize" style={{ color: '#9c7070' }}>
                      {proveedor.categoria}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <WhatsAppLink numero={proveedor.numero_de_contacto} />
                    </td>
                    <td className="px-4 py-3">
                      <RankingBadge ranking={proveedor.ranking} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewModal(proveedor)}
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
                          onClick={() => setEditModal(proveedor)}
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
                        <button
                          onClick={() => setDeleteModal(proveedor)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80"
                          style={{
                            background: 'rgba(255,255,255,0.7)',
                            border: '1px solid #FECACA',
                            color: '#b91c1c',
                            boxShadow: '0 1px 3px rgba(81,49,44,0.08)',
                          }}
                        >
                          <Trash2 size={12} />
                          Borrar
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

      {createModal && (
        <CreateModal
          onClose={() => setCreateModal(false)}
          onSave={handleCreate}
        />
      )}
      {viewModal && (
        <ViewModal proveedor={viewModal} onClose={() => setViewModal(null)} />
      )}
      {editModal && (
        <EditModal
          proveedor={editModal}
          onClose={() => setEditModal(null)}
          onSave={handleEditSave}
        />
      )}
      {deleteModal && (
        <DeleteModal
          proveedor={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'endulzame_project' },
})

export interface Proveedor {
  id: string
  created_at: string | null
  nombre_proveedor: string
  categoria: string
  numero_de_contacto: string
  ranking: number
}

export interface Pedido {
  id: string
  tipo_seccion: string
  created_at: string | null
  estado: string | null
  nombre: string
  telefono: string
  email: string
  fecha_entrega: string
  tipo_torta: string
  porciones: string
  bizcochuelo: string
  relleno: string
  relleno_2: string | null
  foto: string
  info_extra: string | null
  bizcochuelo_piso2: string | null
  bizcochuelo_piso3: string | null
  agregado_1: string | null
  agregado_2: string | null
  agregado_3: string | null
  cookies: string | null
  oreos: string | null
  cupcakes: string | null
  alfajores: string | null
  popcakes: string | null
  icepops: string | null
}

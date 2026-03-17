# Base de Datos — Endulzame Dashboard

**Motor:** PostgreSQL (Supabase)
**Schema:** `endulzame_project`
**Autenticación:** Supabase Auth (RLS basado en `authenticated`)

---

## Índice

- [Conexión](#conexión)
- [Schema](#schema)
- [Tablas](#tablas)
  - [pedidos](#pedidos)
  - [proveedores](#proveedores)
- [Scripts SQL](#scripts-sql)
  - [Crear tabla pedidos](#crear-tabla-pedidos)
  - [Crear tabla proveedores](#crear-tabla-proveedores)
- [Row Level Security (RLS)](#row-level-security-rls)

---

## Conexión

El cliente de Supabase se inicializa en `src/lib/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { db: { schema: 'endulzame_project' } }
)
```

Variables de entorno requeridas en `.env`:

```
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

---

## Schema

Todas las tablas se crean bajo el schema `endulzame_project` (no el schema público por defecto).
Para ejecutar scripts en este schema usar:

```sql
SET search_path TO endulzame_project;
```

---

## Tablas

### pedidos

Almacena los pedidos de tortas y productos de la pastelería.

| Columna              | Tipo    | Nulo | Descripción                                      |
|----------------------|---------|------|--------------------------------------------------|
| `id`                 | UUID    | NO   | Clave primaria, generada automáticamente         |
| `created_at`         | TIMESTAMPTZ | SÍ | Fecha y hora de creación del registro           |
| `estado`             | TEXT    | SÍ   | Estado del pedido: `pendiente`, `en proceso`, `listo`, `entregado` |
| `tipo_seccion`       | TEXT    | NO   | Categoría de torta (ej. cumpleaños, casamiento)  |
| `nombre`             | TEXT    | NO   | Nombre del cliente                               |
| `telefono`           | TEXT    | NO   | Teléfono del cliente                             |
| `email`              | TEXT    | NO   | Email del cliente                                |
| `fecha_entrega`      | DATE    | NO   | Fecha pactada de entrega                         |
| `tipo_torta`         | TEXT    | NO   | Tipo/descripción de la torta                     |
| `porciones`          | TEXT    | NO   | Cantidad de porciones                            |
| `bizcochuelo`        | TEXT    | NO   | Tipo de bizcochuelo del piso principal           |
| `bizcochuelo_piso2`  | TEXT    | SÍ   | Tipo de bizcochuelo piso 2 (tortas altas)        |
| `bizcochuelo_piso3`  | TEXT    | SÍ   | Tipo de bizcochuelo piso 3 (tortas altas)        |
| `relleno`            | TEXT    | NO   | Relleno principal                                |
| `relleno_2`          | TEXT    | SÍ   | Segundo relleno (opcional)                       |
| `agregado_1`         | TEXT    | SÍ   | Agregado decorativo 1                            |
| `agregado_2`         | TEXT    | SÍ   | Agregado decorativo 2                            |
| `agregado_3`         | TEXT    | SÍ   | Agregado decorativo 3                            |
| `cookies`            | TEXT    | SÍ   | Cantidad/descripción de cookies extra            |
| `oreos`              | TEXT    | SÍ   | Cantidad/descripción de oreos extra              |
| `cupcakes`           | TEXT    | SÍ   | Cantidad/descripción de cupcakes extra           |
| `alfajores`          | TEXT    | SÍ   | Cantidad/descripción de alfajores extra          |
| `popcakes`           | TEXT    | SÍ   | Cantidad/descripción de popcakes extra           |
| `icepops`            | TEXT    | SÍ   | Cantidad/descripción de ice pops extra           |
| `foto`               | TEXT    | NO   | URL de foto de referencia                        |
| `info_extra`         | TEXT    | SÍ   | Notas adicionales del pedido                     |

**Estados válidos para `estado`:**

| Valor        | Descripción                        |
|--------------|------------------------------------|
| `pendiente`  | Pedido recibido, sin comenzar      |
| `en proceso` | Pedido en elaboración              |
| `listo`      | Pedido terminado, esperando retiro |
| `entregado`  | Pedido entregado al cliente        |

---

### proveedores

Almacena los proveedores de insumos, packaging y servicios.

| Columna              | Tipo      | Nulo | Descripción                                         |
|----------------------|-----------|------|-----------------------------------------------------|
| `id`                 | UUID      | NO   | Clave primaria, generada automáticamente            |
| `created_at`         | TIMESTAMPTZ | SÍ | Fecha y hora de creación del registro              |
| `nombre_proveedor`   | TEXT      | NO   | Nombre del proveedor o empresa                      |
| `categoria`          | TEXT      | NO   | Categoría del proveedor (ingredientes, packaging, decoración, equipamiento, otros) |
| `numero_de_contacto` | TEXT      | NO   | Teléfono o medio de contacto                        |
| `ranking`            | SMALLINT  | NO   | Calificación del 1 al 5 (default: 3)                |

**Restricción en `ranking`:** `CHECK (ranking BETWEEN 1 AND 5)`

---

## Scripts SQL

### Crear tabla pedidos

> Ejecutar en el SQL Editor de Supabase.

```sql
SET search_path TO endulzame_project;

CREATE TABLE pedidos (
  id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         TIMESTAMPTZ  DEFAULT NOW(),
  estado             TEXT         DEFAULT 'pendiente',
  tipo_seccion       TEXT         NOT NULL,
  nombre             TEXT         NOT NULL,
  telefono           TEXT         NOT NULL,
  email              TEXT         NOT NULL,
  fecha_entrega      DATE         NOT NULL,
  tipo_torta         TEXT         NOT NULL,
  porciones          TEXT         NOT NULL,
  bizcochuelo        TEXT         NOT NULL,
  bizcochuelo_piso2  TEXT,
  bizcochuelo_piso3  TEXT,
  relleno            TEXT         NOT NULL,
  relleno_2          TEXT,
  agregado_1         TEXT,
  agregado_2         TEXT,
  agregado_3         TEXT,
  cookies            TEXT,
  oreos              TEXT,
  cupcakes           TEXT,
  alfajores          TEXT,
  popcakes           TEXT,
  icepops            TEXT,
  foto               TEXT         NOT NULL,
  info_extra         TEXT
);

ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pedidos_select"
  ON pedidos FOR SELECT TO authenticated USING (true);

CREATE POLICY "pedidos_insert"
  ON pedidos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "pedidos_update"
  ON pedidos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "pedidos_delete"
  ON pedidos FOR DELETE TO authenticated USING (true);
```

---

### Crear tabla proveedores

> Ejecutar en el SQL Editor de Supabase.

```sql
SET search_path TO endulzame_project;

CREATE TABLE proveedores (
  id                 UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  nombre_proveedor   TEXT       NOT NULL,
  categoria          TEXT       NOT NULL,
  numero_de_contacto TEXT       NOT NULL,
  ranking            SMALLINT   NOT NULL DEFAULT 3 CHECK (ranking BETWEEN 1 AND 5)
);

ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proveedores_select"
  ON proveedores FOR SELECT TO authenticated USING (true);

CREATE POLICY "proveedores_insert"
  ON proveedores FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "proveedores_update"
  ON proveedores FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "proveedores_delete"
  ON proveedores FOR DELETE TO authenticated USING (true);
```

---

## Row Level Security (RLS)

Todas las tablas tienen RLS habilitado. Las políticas aplican únicamente a usuarios con rol `authenticated` (usuarios con sesión activa en Supabase Auth).

| Operación | Política              | Rol           | Condición  |
|-----------|-----------------------|---------------|------------|
| SELECT    | `*_select`            | authenticated | `true`     |
| INSERT    | `*_insert`            | authenticated | `true`     |
| UPDATE    | `*_update`            | authenticated | `true`     |
| DELETE    | `*_delete`            | authenticated | `true`     |

> Usuarios no autenticados (`anon`) no tienen acceso a ninguna tabla.

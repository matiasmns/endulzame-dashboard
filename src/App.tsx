import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Home from './pages/Home'
import Pedidos from './pages/Pedidos'
import CalendarioPage from './pages/CalendarioPage'
import Proveedores from './pages/Proveedores'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />}>
          <Route index element={<Navigate to="pedidos" replace />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="calendario" element={<CalendarioPage />} />
          <Route path="proveedores" element={<Proveedores />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

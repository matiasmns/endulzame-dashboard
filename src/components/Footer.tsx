import texture02 from '../assets/img/background/texture_02.png'
import logo from '../assets/img/Logo_N.png'

export default function Footer() {
  return (
    <footer
      className="w-full relative z-10 bg-[#a86761]"
      style={{ boxShadow: '0 -4px 10px rgba(81,49,44,0.35)' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70 pointer-events-none"
        style={{ backgroundImage: `url(${texture02})` }}
      />
      <div className="relative flex flex-col items-center justify-center py-3 gap-1">
        <img src={logo} alt="Logo Endulzame" className="h-10 w-auto" />
        <p className="text-sm text-white">
          © 2026 Endulzame · Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}

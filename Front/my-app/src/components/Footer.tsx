export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 px-4 md:px-10 py-10 mt-20 border-t border-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-2">Bendito Calzado</h4>
          <p className="text-sm text-gray-400">
            Sistema ERP diseñado para ayudarte a organizar y escalar tu negocio de forma inteligente y sencilla.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Navegación</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/productos" className="text-gray-200 hover:text-white hover:underline">
                Productos
              </a>
            </li>
            <li>
              <a href="/registro" className="text-gray-200 hover:text-white hover:underline">
                Registro
              </a>
            </li>
            <li>
              <a href="/login" className="text-gray-200 hover:text-white hover:underline">
                Iniciar sesión
              </a>
            </li>
            <li>
              <a href="/blog" className="text-gray-200 hover:text-white hover:underline">
                Blog
              </a>
            </li>
            <li>
              <a href="/contacto" className="text-gray-200 hover:text-white hover:underline">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Síguenos</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#" className="text-gray-200 hover:text-white hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-200 hover:text-white hover:underline">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-200 hover:text-white hover:underline">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-10">
        © {new Date().getFullYear()} Bendito Calzado. Todos los derechos reservados.
      </div>
    </footer>
  )
}

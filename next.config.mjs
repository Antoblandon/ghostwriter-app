/** @type {import('next').NextConfig} */
const nextConfig = {
  // En las nuevas versiones, Next.js prefiere que esté aquí o se maneje automáticamente
  // Pero si el aviso persiste, colócalo así:
  devIndicators: {
    appIsrStatus: false, // Opcional: limpia la interfaz de avisos de renderizado
  },
  // Intenta moverlo al nivel raíz así:
  allowedDevOrigins: ["192.168.56.1"], 
  
  // Si usas Turbopack, a veces es mejor dejar que Next detecte el origen 
  // simplemente ignorando el aviso por ahora, ya que es un "Future Warning"
};

export default nextConfig;
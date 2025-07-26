"use client"
import Image from "next/image"
import { Lock, CheckSquare, Square, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false)
  
  // API URL y token de autenticación
  const API_URL = "https://prod-20.brazilsouth.logic.azure.com:443/workflows/5afe38a58d2a46e7ad6ca3f4d6d46764/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kinQJuABhdup4BvZBOkMe9nZuSb1RgYPHlcqdkTXBo0"
  const AUTH_TOKEN = "xt_3$*y9e2-XFC%*DCXIOS-FP**SID-9C2#2$"

  const handleLogin = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    // Validación de campos
    if (!user || !password) {
      setError("Por favor completa ambos campos.")
      return
    }
    
    // Validación de ALTCHA
    if (!isCaptchaChecked) {
      setError("Por favor verifica que no eres un robot.")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": AUTH_TOKEN
        },
        body: JSON.stringify({
          usuario: user,
          password: password
        })
      })
      
      const data = await response.json()
      
      // Verificar respuesta (ajusta la condición según la estructura real de tu respuesta)
      if (response.ok && !data.error) {
        // Autenticación exitosa
        router.push("/code")
      } else {
        // Error en la autenticación
        setError(data.message || "Error de autenticación. Verifique sus credenciales.")
      }
    } catch (error: unknown) {
      setError("Error al conectar con el servidor: " + (error instanceof Error ? error.message : "Error desconocido"))
    } finally {
      setIsLoading(false)
    }
  }
  
  // Componente simple de ALTCHA "No soy un robot"
  const AltchaCheckbox = () => {
    return (
      <div 
        className="flex items-center gap-2 cursor-pointer select-none mt-4 mb-2"
        onClick={() => setIsCaptchaChecked(!isCaptchaChecked)}
      >
        <div className="flex items-center justify-center w-5 h-5 border border-gray-400 rounded">
          {isCaptchaChecked ? (
            <CheckSquare className="w-5 h-5 text-green-600" />
          ) : (
            <Square className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <span className="text-gray-700">No soy un robot</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/fondo.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/80 via-teal-500/60 to-blue-500/80" />
      </div>
      
      {/* Barra lateral */}
      <div className="relative z-10 w-16 md:w-20 flex-shrink-0">
        <div className="h-full w-full flex flex-col items-center py-4" style={{background: "linear-gradient(to bottom, #0d8517, rgba(12, 61, 114, 1)" }}>
          <div className="w-16 h-16 md:w-18 md:h-20 rounded-full flex items-center justify-center mb-4">
            <Image src="/nav.png" alt="Mini Logo" width={200} height={200} className="rounded-full object-cover w-14 h-14 md:w-16 md:h-16" />
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="relative flex-1">
        <div className="absolute inset-0 z-0">
          <Image src="/fondo.png" alt="Fondo" fill className="object-cover" priority />
        </div>
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center mb-4 md:mb-6">
              <Lock className="w-16 h-16 md:w-20 md:h-20 text-white mr-4 md:mr-6" />
              <div className="h-16 md:h-20 w-1 bg-white mr-4 md:mr-6" />
              <div className="text-left">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">Control de acceso</h1>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">a plantas</h2>
              </div>
            </div>
          </div>
          
          {/* Formulario */}
          <Card className="w-full max-w-md md:max-w-lg bg-white shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">Iniciar sesión</CardTitle>
              <p className="text-sm md:text-base text-gray-600 mt-2">Ingrese su usuario y contraseña</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input 
                  type="text" 
                  placeholder="Usuario" 
                  value={user} 
                  onChange={(e) => setUser(e.target.value)} 
                  disabled={isLoading}
                />
                <Input 
                  type="password" 
                  placeholder="Contraseña" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  disabled={isLoading}
                />
                
                <AltchaCheckbox />
                
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                
                <Button 
                  onClick={handleLogin}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg mt-4" 
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando..." : "Ingresar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Logo inferior */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20">
        <Image src="/logo.png" alt="Company Logo" width={120} height={40} className="opacity-90" />
      </div>
    </div>
  )
}
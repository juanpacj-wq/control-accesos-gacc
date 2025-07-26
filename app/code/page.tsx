"use client"

import Image from "next/image"
import { Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function AccessControlPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleContinue = async () => {
    setError("")

    if (code.trim() === "") {
      setError("Por favor ingrese el código de solicitud.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        "https://prod-09.brazilsouth.logic.azure.com:443/workflows/678622418e6444a9bb028323e0da2070/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3P1ctlZtuXT5-w30B-IwutHkvwZlTcw0LdU8eiyRsjU",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": "u6fqeop-ZGSKZWDYDJ-OH9*MQC-CSKS%YZP",
          },
          body: JSON.stringify({ id_solicitud: code }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        // Pasar el id_solicitud como query parameter al dashboard
        router.push(`/dashboard?solicitud=${encodeURIComponent(code)}`)
      } else {
        setError(data.mensaje || "Código inválido o no autorizado.")
      }
    } catch (err) {
      setError("Error al conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/fondo.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/80 via-teal-500/60 to-blue-500/80" />
      </div>

      {/* Barra lateral */}
      <div className="relative z-10 w-16 md:w-20 flex-shrink-0">
        <div
          className="h-full w-full flex flex-col items-center py-4"
          style={{
            background: "linear-gradient(to bottom, #0d8517, rgba(12, 61, 114, 1))",
          }}
        >
          <div className="w-16 h-16 md:w-18 md:h-20rounded-full flex items-center justify-center mb-4">
            <Image
              src="/nav.png"
              alt="Mini Logo"
              width={200}
              height={200}
              className="rounded-full object-cover w-14 h-14 md:w-16 md:h-16"
            />
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative flex-1">
        <div className="absolute inset-0 z-0">
          <Image
            src="/fondo.png"
            alt="Fondo"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
          {/* Título */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center mb-4 md:mb-6">
              <Lock className="w-16 h-16 md:w-20 md:h-20 text-white mr-4 md:mr-6" />
              <div className="h-16 md:h-20 w-1 bg-white mr-4 md:mr-6" />
              <div className="text-left">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Control de acceso
                </h1>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  a plantas
                </h2>
              </div>
            </div>
          </div>

          {/* Tarjeta de ingreso de código */}
          <Card className="w-full max-w-md md:max-w-lg bg-white shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">¡Bienvenid@!</CardTitle>
              <p className="text-sm md:text-base text-gray-600 mt-2">
                Para ingresar digite el código de la solicitud que enviamos a su correo electrónico
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Ingrese el código"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-12 text-center text-lg border-2 border-gray-200 focus:border-blue-500 placeholder-gray-400 focus:placeholder-transparent"
                  disabled={loading}
                />

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <Button
                  onClick={handleContinue}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Verificando..." : "Ingresar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logo inferior derecho */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20">
        <Image src="/logo.png" alt="Company Logo" width={120} height={40} className="opacity-90" />
      </div>
    </div>
  )
}
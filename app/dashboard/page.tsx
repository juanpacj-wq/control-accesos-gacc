// app/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { API_URLS, AUTH_TOKENS, PersonaRegistro, VehiculoRegistro, VehiculoResponse, TipoIngreso } from "./types"

// Importando los componentes modulares
import Sidebar from "./modules/layout/Sidebar"
import Header, { RegistrosSummary } from "./modules/layout/Header"
import Filters from "./modules/utils/Filters"
import PersonaTable from "./modules/personas/PersonaTable"
import PersonaForm from "./modules/personas/PersonaForm"
import PersonaDocumentos from "./modules/personas/PersonaDocumentos"
import VehiculoTable from "./modules/vehiculos/VehiculoTable"
import VehiculoForm from "./modules/vehiculos/VehiculoForm"
import VehiculoDocumentos from "./modules/vehiculos/VehiculoDocumentos"

export default function DashboardPage() {
 const router = useRouter()
 const searchParams = useSearchParams()
 
 // Estados principales
 const [tipoIngreso, setTipoIngreso] = useState<TipoIngreso>("persona")
 const [idSolicitud, setIdSolicitud] = useState<string>("")
 const [idPersona, setIdPersona] = useState<string>("")
 const [idVehiculo, setIdVehiculo] = useState<string>("") // Nuevo estado para vehículos
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState("")
 const [isDialogOpen, setIsDialogOpen] = useState(false)
 const [activeTab, setActiveTab] = useState("general")
 
 // Estados para los datos
 const [personas, setPersonas] = useState<PersonaRegistro[]>([])
 const [vehiculos, setVehiculos] = useState<VehiculoRegistro[]>([])
 
 // Estados para filtros
 const [filtroNombre, setFiltroNombre] = useState("")
 const [filtroEstado, setFiltroEstado] = useState("todos")
 
 // Estado para la edición
 const [editMode, setEditMode] = useState(false)
 const [currentPersona, setCurrentPersona] = useState<PersonaRegistro | null>(null)
 const [currentVehiculo, setCurrentVehiculo] = useState<VehiculoRegistro | null>(null)
 
 // Obtener el id_solicitud de los query parameters
 useEffect(() => {
   const solicitudParam = searchParams.get("solicitud")
   if (solicitudParam) {
     setIdSolicitud(solicitudParam)
   } else {
     // Si no hay parámetro, redirigir a la página de login
     router.push("/")
   }
 }, [searchParams, router])

 // Cargar datos cuando se tenga el id_solicitud
 useEffect(() => {
   if (idSolicitud) {
     if (tipoIngreso === "persona") {
       fetchPersonas()
     } else {
       fetchVehiculos()
     }
   }
 }, [idSolicitud, tipoIngreso])

 // Funciones para buscar datos
 const fetchPersonas = async () => {
   if (!idSolicitud) return
   
   setLoading(true)
   setError("")
   
   try {
     const response = await fetch(API_URLS.FLOW_URL_PERSONAS, {
       method: "POST",
       headers: { 
         "Content-Type": "application/json",
         "x-auth-token": AUTH_TOKENS.PERSONAS
       },
       body: JSON.stringify({ id_solicitud: idSolicitud })
     })
     
     const data = await response.json()
     
     if (!response.ok) {
       throw new Error(data.error || response.statusText)
     }
     
     // Transformar los datos para incluir id_persona
     const personasData = Array.isArray(data) ? data : [data]
     const personasConId = personasData.map((persona: any) => ({
       ...persona,
       id_persona: persona.Title || persona.id_persona // Mapear Title a id_persona
     }))
     
     setPersonas(personasConId)
   } catch (err) {
     setError(err instanceof Error ? err.message : "Error al cargar los datos")
     console.error("Error:", err)
   } finally {
     setLoading(false)
   }
 }

 const fetchVehiculos = async () => {
   if (!idSolicitud) return
   
   setLoading(true)
   setError("")
   
   try {
     const response = await fetch(API_URLS.FLOW_URL_VEHICULOS, {
       method: "POST",
       headers: { 
         "Content-Type": "application/json",
         "x-auth-token": AUTH_TOKENS.VEHICULOS
       },
       body: JSON.stringify({ id_solicitud: idSolicitud })
     })
     
     const data = await response.json()
     
     if (!response.ok) {
       throw new Error(data.error || response.statusText)
     }
     
     // Transformar la respuesta al formato esperado
     const vehiculosData = Array.isArray(data) ? data : [data]
     const vehiculosTransformados: VehiculoRegistro[] = vehiculosData.map((v: VehiculoResponse) => ({
       id_vehiculo: v.ID_VEHICULO || '',
       placa: v.PLACA || '-',
       marca: v.MARCA || '-',
       modelo: v.MODELO || '-',
       color: v.COLOR || '-',
       conductores: v.CONDUCTORES || '-',
       estado: v.ESTADO === "APROBADO" ? "APROBADO" : "PENDIENTE"
     }))
     
     setVehiculos(vehiculosTransformados)
   } catch (err) {
     setError(err instanceof Error ? err.message : "Error al cargar los vehículos")
     console.error("Error:", err)
   } finally {
     setLoading(false)
   }
 }

 // Manejadores de eventos
 const handleLogout = () => {
   router.push("/")
 }

 const handleRefresh = () => {
   if (tipoIngreso === "persona") {
     fetchPersonas()
   } else {
     fetchVehiculos()
   }
 }

 const handleOpenDialog = () => {
   setEditMode(false)
   setCurrentPersona(null)
   setCurrentVehiculo(null)
   setActiveTab("general")
   setIsDialogOpen(true)
 }

 // Manejador para editar una persona
 const handleEditPersona = (persona: PersonaRegistro) => {
   setEditMode(true)
   setCurrentPersona(persona)
   // Usar el id_persona si está disponible, sino usar Title como fallback
   if (persona.id_persona) {
     setIdPersona(persona.id_persona)
   } else if (persona.Title) {
     setIdPersona(persona.Title)
   }
   setActiveTab("general")
   setIsDialogOpen(true)
 }

 // Manejador para editar un vehículo
 const handleEditVehiculo = (vehiculo: VehiculoRegistro) => {
   setEditMode(true)
   setCurrentVehiculo(vehiculo)
   if (vehiculo.id_vehiculo) {
     setIdVehiculo(vehiculo.id_vehiculo)
   }
   setActiveTab("general")
   setIsDialogOpen(true)
 }

 // Manejador para cambiar de pestaña
 const handleSetTab = (tab: string) => {
   setActiveTab(tab)
 }

 // Manejador para guardar el ID de la persona registrada
 const handleSetPersonaId = (id: string) => {
   setIdPersona(id)
 }

 // Manejador para guardar el ID del vehículo registrado
 const handleSetVehiculoId = (id: string) => {
   setIdVehiculo(id)
 }

 // Función para limpiar el formulario después de cerrar el diálogo
 const handleCloseDialog = () => {
   setIsDialogOpen(false)
   setEditMode(false)
   setCurrentPersona(null)
   setCurrentVehiculo(null)
   setIdPersona("")
   setIdVehiculo("")
 }

 return (
   <TooltipProvider>
     <div className="min-h-screen flex bg-gradient-to-r from-green-600 to-blue-600">
       {/* Sidebar */}
       <Sidebar 
         tipoIngreso={tipoIngreso} 
         setTipoIngreso={setTipoIngreso} 
         onLogout={handleLogout} 
       />

       {/* Main Content */}
       <main className="flex-1 bg-gray-50 p-4 overflow-hidden -mt-1">
         <div className="max-w-7xl mx-auto mt-0">
           {/* Encabezado */}
           <Header 
             tipoIngreso={tipoIngreso}
             loading={loading}
             onRefresh={handleRefresh}
             onOpenDialog={handleOpenDialog}
             idSolicitud={idSolicitud}
           />

           {/* Contador de registros */}
           {!loading && ((tipoIngreso === "persona" && personas.length > 0) || 
                        (tipoIngreso === "vehiculo" && vehiculos.length > 0)) && (
             <RegistrosSummary 
               tipoIngreso={tipoIngreso} 
               count={tipoIngreso === "persona" ? personas.length : vehiculos.length}
               idSolicitud={idSolicitud}
             />
           )}

           {/* Filtros */}
           <Filters 
             tipoIngreso={tipoIngreso}
             filtroNombre={filtroNombre}
             setFiltroNombre={setFiltroNombre}
             filtroEstado={filtroEstado}
             setFiltroEstado={setFiltroEstado}
           />

           {/* Mensaje de error */}
           {error && (
             <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700 mb-2">
               <p className="font-medium text-sm">Error al cargar los datos</p>
               <p className="text-xs">{error}</p>
             </div>
           )}

           {/* Tabla correspondiente según el tipo de ingreso */}
           {tipoIngreso === "persona" ? (
             <PersonaTable 
               personas={personas}
               loading={loading}
               filtroNombre={filtroNombre}
               filtroEstado={filtroEstado}
               onEdit={handleEditPersona}
             />
           ) : (
             <VehiculoTable 
               vehiculos={vehiculos}
               loading={loading}
               filtroNombre={filtroNombre}
               filtroEstado={filtroEstado}
               onEdit={handleEditVehiculo}
             />
           )}

           {/* Footer: botón a la izq. y texto a la der. */}
           <div className="mt-3 flex items-center justify-between">
             <span className="text-xs text-gray-600">
               La solicitud fue marcada como terminada el 22 julio 2025 16:17
             </span>
             <Button
               variant="destructive"
               size="sm"
               className="h-6 px-2 text-xs"
               onClick={() => { /* lógica de terminar */ }}
             >
               Terminar solicitud
             </Button>
           </div>
         </div>
       </main>
     </div>
     
     {/* Diálogo para agregar o editar persona o vehículo */}
     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
       <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
         {/* Header con título */}
         <div className="flex justify-between items-center -mt-2 -mb-2">
           <h2 className="text-4xl font-bold">
             {editMode 
               ? `${tipoIngreso === "persona" ? "Editar Persona" : "Editar Vehículo"}`
               : `${tipoIngreso === "persona" ? "Agregar Persona" : "Agregar Vehículo"}`
             }
           </h2>
         </div>

         <Tabs value={activeTab} onValueChange={(value) => {
           // Validar que exista un ID antes de permitir cambiar a la pestaña de adjuntos
           if (value === "adjuntos") {
             if ((tipoIngreso === "persona" && !idPersona) || 
                 (tipoIngreso === "vehiculo" && !idVehiculo)) {
               // Si no hay ID, mantener la pestaña actual
               return;
             }
           }
           setActiveTab(value);
         }} className="w-full">
           <TabsList className="grid w-full grid-cols-2">
             <TabsTrigger value="general">
               {tipoIngreso === "persona" ? "Información Personal" : "Información del Vehículo"}
             </TabsTrigger>
             <TabsTrigger 
               value="adjuntos" 
               disabled={(tipoIngreso === "persona" && !idPersona) || 
                       (tipoIngreso === "vehiculo" && !idVehiculo)}
               className={((tipoIngreso === "persona" && !idPersona) || 
                         (tipoIngreso === "vehiculo" && !idVehiculo)) ? 
                         "opacity-50 cursor-not-allowed" : ""}
             >
               Adjuntos
             </TabsTrigger>
           </TabsList>
           
           {/* TAB GENERAL */}
           <TabsContent value="general" className="mt-2">
             {tipoIngreso === "persona" ? (
               <PersonaForm 
                 idSolicitud={idSolicitud}
                 idPersona={editMode && idPersona ? idPersona : ""}
                 personaData={currentPersona}
                 isEdit={editMode}
                 onSuccess={fetchPersonas}
                 onClose={handleCloseDialog}
                 onSetTab={handleSetTab}
                 onSetPersonaId={handleSetPersonaId}
               />
             ) : (
               <VehiculoForm 
                 idSolicitud={idSolicitud}
                 idVehiculo={editMode && idVehiculo ? idVehiculo : ""}
                 vehiculoData={currentVehiculo}
                 isEdit={editMode}
                 onSuccess={fetchVehiculos}
                 onClose={handleCloseDialog}
                 onSetTab={handleSetTab}
                 onSetVehiculoId={handleSetVehiculoId}
               />
             )}
           </TabsContent>
           
           {/* TAB ADJUNTOS */}
           <TabsContent value="adjuntos" className="mt-2">
             {tipoIngreso === "persona" ? (
               idPersona ? (
                 <PersonaDocumentos
                   idSolicitud={idSolicitud}
                   idPersona={idPersona}
                   onClose={() => setIsDialogOpen(false)}
                 />
               ) : (
                 <div className="text-center py-8">
                   <p className="text-gray-600">
                     Primero debe registrar la información básica de la persona
                   </p>
                 </div>
               )
             ) : (
               idVehiculo ? (
                 <VehiculoDocumentos
                   idSolicitud={idSolicitud}
                   idVehiculo={idVehiculo}
                   onClose={() => setIsDialogOpen(false)}
                 />
               ) : (
                 <div className="text-center py-8">
                   <p className="text-gray-600">
                     Primero debe registrar la información básica del vehículo
                   </p>
                 </div>
               )
             )}
           </TabsContent>
         </Tabs>
       </DialogContent>
     </Dialog>
   </TooltipProvider>
 )
}
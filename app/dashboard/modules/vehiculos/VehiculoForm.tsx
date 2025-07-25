// app/dashboard/modules/vehiculos/VehiculoForm.tsx
"use client"

import { useState, useEffect } from "react"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { 
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { VehiculoFormData, VehiculoRegistro, AUTH_TOKENS, API_URLS } from "../../types"

interface VehiculoFormProps {
 idSolicitud: string;
 idVehiculo?: string;
 vehiculoData?: VehiculoRegistro | null;
 isEdit?: boolean;
 onSuccess: () => void;
 onClose: () => void;
 onSetTab?: (tab: string) => void;
 onSetVehiculoId?: (id: string) => void;
}

export default function VehiculoForm({ 
 idSolicitud,
 idVehiculo = "",
 vehiculoData = null,
 isEdit = false,
 onSuccess, 
 onClose,
 onSetTab,
 onSetVehiculoId
}: VehiculoFormProps) {
 // Estado para el formulario
 const [formData, setFormData] = useState<VehiculoFormData>({
   placa: '',
   marca: '',
   modelo: '',
   color: '',
   conductores: ''
 });

 // Estados para manejar el proceso
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [showConfirmation, setShowConfirmation] = useState(false);

 // Cargar datos si estamos en modo edición
 useEffect(() => {
   if (isEdit && vehiculoData) {
     setFormData({
       placa: vehiculoData.placa || '',
       marca: vehiculoData.marca || '',
       modelo: vehiculoData.modelo || '',
       color: vehiculoData.color || '',
       conductores: vehiculoData.conductores || ''
     });
     
     // Si tenemos un idVehiculo, lo usamos para establecer el ID
     if (idVehiculo && onSetVehiculoId) {
       onSetVehiculoId(idVehiculo);
     }
   }
 }, [isEdit, vehiculoData, idVehiculo, onSetVehiculoId]);

 // Manejador de cambios en el formulario
 const handleVehiculoChange = (field: string, value: string) => {
   setFormData(prev => ({
     ...prev,
     [field]: value
   }));
 };

 // Mostrar diálogo de confirmación
 const handleGuardarVehiculo = () => {
   setShowConfirmation(true);
 };

 // Enviar datos del formulario
 const handleConfirmRegistrarVehiculo = async () => {
   // Generar un nuevo ID sólo si no estamos en modo edición
   const vehiculoId = isEdit && idVehiculo ? idVehiculo : crypto.randomUUID();
   
   const vehiculoDataToSend = {
     id_solicitud: idSolicitud,
     id_vehiculo: vehiculoId,
     placa: formData.placa,
     marca: formData.marca,
     modelo: formData.modelo,
     color: formData.color,
     conductores: formData.conductores
   };

   try {
     setLoading(true);
     const response = await fetch(
       API_URLS.FLOW_URL_REGISTER_VEHICULO,
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           "x-auth-token": AUTH_TOKENS.REGISTER_VEHICULO
         },
         body: JSON.stringify(vehiculoDataToSend)
       }
     );

     if (!response.ok) throw new Error("No se pudo registrar el vehículo");

     const result = await response.json();
     console.log(`✅ Vehículo ${isEdit ? 'actualizado' : 'registrado'}:`, result);
     
     // Guardar el ID del vehículo para usarlo en la carga de archivos
     if (onSetVehiculoId) {
       onSetVehiculoId(vehiculoId);
     }
     
     // Limpiar formulario solo si no estamos en modo edición
     if (!isEdit) {
       setFormData({
         placa: '',
         marca: '',
         modelo: '',
         color: '',
         conductores: ''
       });
     }
     
     setShowConfirmation(false); // Cerrar diálogo de confirmación
     onSuccess(); // Notificar al componente padre
     
     // Cambiar a la pestaña de adjuntos si está disponible
     if (onSetTab) {
       onSetTab("adjuntos");
     } else {
       onClose(); // Cerrar el diálogo principal
     }
     
   } catch (error) {
     console.error(`❌ Error al ${isEdit ? 'actualizar' : 'registrar'} vehículo:`, error);
     setError(error instanceof Error ? error.message : `Error al ${isEdit ? 'actualizar' : 'registrar'} vehículo`);
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
     <DialogHeader className="pb-2">
       <DialogTitle>{isEdit ? 'Editar información del vehículo' : 'Información del vehículo'}</DialogTitle>
     </DialogHeader>
     
     <div className="space-y-3 mt-2">
       {/* Fila 1: Placa y Marca */}
       <div className="grid grid-cols-2 gap-3">
         <div>
           <Label htmlFor="placa" className="text-xs">* PLACA (Ejemplo: ACB-123)</Label>
           <Input 
             id="placa" 
             placeholder="ACB-123" 
             value={formData.placa}
             onChange={(e) => handleVehiculoChange('placa', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
         <div>
           <Label htmlFor="marca" className="text-xs">* MARCA</Label>
           <Input 
             id="marca" 
             placeholder="Ej. Toyota, Chevrolet" 
             value={formData.marca}
             onChange={(e) => handleVehiculoChange('marca', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
       </div>

       {/* Fila 2: Modelo y Color */}
       <div className="grid grid-cols-2 gap-3">
         <div>
           <Label htmlFor="modelo" className="text-xs">* MODELO</Label>
           <Input 
             id="modelo" 
             placeholder="Ej. Corolla, Spark"
             value={formData.modelo}
             onChange={(e) => handleVehiculoChange('modelo', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
         <div>
           <Label htmlFor="color" className="text-xs">* COLOR</Label>
           <Input 
             id="color" 
             placeholder="Ej. Blanco, Azul"
             value={formData.color}
             onChange={(e) => handleVehiculoChange('color', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
       </div>

       {/* Fila 3: Conductores */}
       <div>
         <Label htmlFor="conductores" className="text-xs">* CONDUCTORES (separados por punto y coma)</Label>
         <Input 
           id="conductores" 
           placeholder="Ej. Juan Pérez; María González; Carlos López" 
           value={formData.conductores}
           onChange={(e) => handleVehiculoChange('conductores', e.target.value)}
           className="h-8 text-sm"
         />
         <p className="text-xs text-gray-500 mt-1">
           Ingrese los nombres de los conductores separados por punto y coma (;)
         </p>
       </div>

       {/* Mostrar error si existe */}
       {error && (
         <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
           {error}
         </div>
       )}
     </div>

     <div className="flex justify-end mt-4 pt-2 border-t">
       <Button 
         onClick={handleGuardarVehiculo}
         className="bg-green-600 hover:bg-green-700 text-white font-medium h-8 px-4 text-sm"
         disabled={!formData.placa || !formData.marca || !formData.modelo || !formData.color || !formData.conductores}
       >
         {isEdit ? 'Actualizar y continuar' : 'Guardar y continuar'}
       </Button>
     </div>

     {/* Diálogo de confirmación */}
     <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
       <AlertDialogContent>
         <AlertDialogHeader>
           <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
           <AlertDialogDescription>
             Se {isEdit ? 'actualizará' : 'enviará'} la información del vehículo a la base de datos. Esta acción no se puede deshacer.
           </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
           <AlertDialogCancel>No, editar datos</AlertDialogCancel>
           <AlertDialogAction 
             onClick={handleConfirmRegistrarVehiculo}
             className="bg-green-600 hover:bg-green-700"
             disabled={loading}
           >
             {loading ? (
               <>
                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                 Enviando...
               </>
             ) : (
               `Sí, ${isEdit ? 'actualizar' : 'enviar'} información`
             )}
           </AlertDialogAction>
         </AlertDialogFooter>
       </AlertDialogContent>
     </AlertDialog>
   </div>
 )
}
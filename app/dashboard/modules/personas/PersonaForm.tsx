// app/dashboard/modules/personas/PersonaForm.tsx
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
import { PersonaFormData, PersonaRegistro, AUTH_TOKENS, API_URLS } from "../../types"

interface PersonaFormProps {
 idSolicitud: string;
 idPersona?: string;
 personaData?: PersonaRegistro | null;
 isEdit?: boolean;
 onSuccess: () => void;
 onClose: () => void;
 onSetTab: (tab: string) => void;
 onSetPersonaId: (id: string) => void;
}

export default function PersonaForm({ 
 idSolicitud, 
 idPersona = "",
 personaData = null,
 isEdit = false,
 onSuccess, 
 onClose, 
 onSetTab,
 onSetPersonaId
}: PersonaFormProps) {
 // Estado para el formulario
 const [formData, setFormData] = useState<PersonaFormData>({
   nombre: '',
   apellidos: '',
   cedula: '',
   correo: '',
   cargo: '',
   arl: '',
   eps: '',
   afp: '',
   certificadoConfinados: '',
   certificadoAltura: '',
   conceptoAltura: '',
   conceptoIngreso: ''
 });

 // Estados para manejar el proceso
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [showConfirmation, setShowConfirmation] = useState(false);

 // Cargar datos si estamos en modo edición
 useEffect(() => {
   if (isEdit && personaData) {
     setFormData({
       nombre: personaData.Nombre || '',
       apellidos: personaData.Apellidos || '',
       cedula: personaData.C_x002e_C || '',
       correo: '', // No está en los datos recibidos, se mantiene vacío
       cargo: personaData.Cargo || '',
       arl: '', // Estos campos no están en los datos recibidos, 
       eps: '', // pero se podrían obtener de una API adicional
       afp: '', // si fuera necesario
       certificadoConfinados: '',
       certificadoAltura: '',
       conceptoAltura: '',
       conceptoIngreso: ''
     });
     
     // Si tenemos un idPersona, lo usamos para establecer el ID
     if (idPersona) {
       onSetPersonaId(idPersona);
     } else if (personaData.id_persona) {
       onSetPersonaId(personaData.id_persona);
     } else if (personaData.Title) {
       onSetPersonaId(personaData.Title);
     }
   }
 }, [isEdit, personaData, idPersona, onSetPersonaId]);

 // Manejador de cambios en el formulario
 const handlePersonaChange = (field: string, value: string) => {
   setFormData(prev => ({
     ...prev,
     [field]: value
   }));
 };

 // Mostrar diálogo de confirmación
 const handleGuardarPersona = () => {
   setShowConfirmation(true);
 };

 // Enviar datos del formulario
 const handleConfirmRegistrarPersona = async () => {
   // En modo edición, usar el idPersona existente; en creación, generar uno nuevo
   let personaId: string;
   
   if (isEdit && idPersona) {
     // En modo edición, mantener el ID existente
     personaId = idPersona;
   } else {
     // En modo creación, generar un nuevo ID
     personaId = crypto.randomUUID();
   }
   
   console.log(`ID de persona en modo ${isEdit ? 'edición' : 'creación'}: ${personaId}`);
  
  const personaDataToSend = {
    id_solicitud: idSolicitud,
    id_persona: personaId, // Usar el ID correcto
    cedula: formData.cedula,
    nombre: formData.nombre,
    apellido: formData.apellidos,
    correo: formData.correo,
    cargo: formData.cargo,
    estado_actividad: "ACTIVO",
    arl: formData.arl,
    eps: formData.eps,
    afp: formData.afp,
    cert_espacios_conf: formData.certificadoConfinados,
    cert_trab_alt: formData.certificadoAltura,
    conc_med_trab_alt: formData.conceptoAltura,
    conc_med_ingreso: formData.conceptoIngreso
  };

   try {
     setLoading(true);
     const response = await fetch(
       API_URLS.FLOW_URL_REGISTER_PERSONA,
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           "x-auth-token": AUTH_TOKENS.REGISTER_PERSONA
         },
         body: JSON.stringify(personaDataToSend)
       }
     );

     if (!response.ok) throw new Error("No se pudo registrar la persona");

     const result = await response.json();
     console.log(`✅ Persona ${isEdit ? 'actualizada' : 'registrada'}:`, result);
     console.log(`📌 ID de persona utilizado: ${personaId}`);
     
     // Guardar el ID de la persona para usarlo en la carga de archivos
     onSetPersonaId(personaId);
     
     // Limpiar formulario solo si no estamos en modo edición
     if (!isEdit) {
       setFormData({
         nombre: '',
         apellidos: '',
         cedula: '',
         correo: '',
         cargo: '',
         arl: '',
         eps: '',
         afp: '',
         certificadoConfinados: '',
         certificadoAltura: '',
         conceptoAltura: '',
         conceptoIngreso: ''
       });
     }
     
     setShowConfirmation(false); // Cerrar diálogo de confirmación
     onSuccess(); // Notificar al componente padre
     
     // Cambiar a la pestaña de adjuntos
     onSetTab("adjuntos");
   } catch (error) {
     console.error("❌ Error al registrar persona:", error);
     setError(error instanceof Error ? error.message : "Error al registrar persona");
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
     <DialogHeader className="pb-2">
       <DialogTitle>{isEdit ? 'Editar información personal' : 'Información personal'}</DialogTitle>
     </DialogHeader>
     
     <div className="space-y-3 mt-2">
       {/* Fila 1: Nombre, Apellidos, Cédula */}
       <div className="grid grid-cols-3 gap-3">
         <div>
           <Label htmlFor="nombre" className="text-xs">* Nombre</Label>
           <Input 
             id="nombre" 
             placeholder="Ej. JADER MANUEL" 
             value={formData.nombre}
             onChange={(e) => handlePersonaChange('nombre', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
         <div>
           <Label htmlFor="apellidos" className="text-xs">* Apellidos</Label>
           <Input 
             id="apellidos" 
             value={formData.apellidos}
             onChange={(e) => handlePersonaChange('apellidos', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
         <div>
           <Label htmlFor="cedula" className="text-xs">* Cédula</Label>
           <Input 
             id="cedula" 
             placeholder="Ej. 123456789" 
             value={formData.cedula}
             onChange={(e) => handlePersonaChange('cedula', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
       </div>

       {/* Fila 2: Correo y Cargo */}
       <div className="grid grid-cols-2 gap-3">
         <div>
           <Label htmlFor="correo" className="text-xs">* Correo</Label>
           <Input 
             id="correo" 
             placeholder="Ej. persona@empresa.com" 
             value={formData.correo}
             onChange={(e) => handlePersonaChange('correo', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
         <div>
           <Label htmlFor="cargo" className="text-xs">* Cargo</Label>
           <Input 
             id="cargo" 
             placeholder="Ej. ALBAÑIL" 
             value={formData.cargo}
             onChange={(e) => handlePersonaChange('cargo', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
       </div>

       {/* Fila 3: ARL, EPS, AFP */}
       <div className="grid grid-cols-3 gap-3">
         <div>
           <Label htmlFor="arl" className="text-xs">* ARL</Label>
           <Input 
             id="arl" 
             placeholder="Ej. SURA" 
             value={formData.arl}
             onChange={(e) => handlePersonaChange('arl', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
         <div>
           <Label htmlFor="eps" className="text-xs">* EPS</Label>
           <Input 
             id="eps" 
             value={formData.eps}
             onChange={(e) => handlePersonaChange('eps', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
         <div>
           <Label htmlFor="afp" className="text-xs">* AFP</Label>
           <Input 
             id="afp" 
             value={formData.afp}
             onChange={(e) => handlePersonaChange('afp', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
       </div>

       {/* Fila 4: Certificados */}
       <div className="grid grid-cols-2 gap-3">
         <div>
           <Label htmlFor="certificado-confinados" className="text-xs">* Certificado espacios confinados</Label>
           <Input 
             id="certificado-confinados" 
             value={formData.certificadoConfinados}
             onChange={(e) => handlePersonaChange('certificadoConfinados', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
         <div>
           <Label htmlFor="certificado-altura" className="text-xs">* Certificado trabajo en altura</Label>
           <Input 
             id="certificado-altura" 
             value={formData.certificadoAltura}
             onChange={(e) => handlePersonaChange('certificadoAltura', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
       </div>

       {/* Fila 5: Conceptos médicos */}
       <div className="grid grid-cols-2 gap-3">
         <div>
           <Label htmlFor="concepto-altura" className="text-xs">* Concepto médico trabajo en altura</Label>
           <Input 
             id="concepto-altura" 
             value={formData.conceptoAltura}
             onChange={(e) => handlePersonaChange('conceptoAltura', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
         <div>
           <Label htmlFor="concepto-ingreso" className="text-xs">* Concepto médico ingreso/periódico</Label>
           <Input 
             id="concepto-ingreso" 
             value={formData.conceptoIngreso}
             onChange={(e) => handlePersonaChange('conceptoIngreso', e.target.value)}
             className="h-8 text-sm"
           />
         </div>
       </div>
     </div>

     <div className="flex justify-end mt-4 pt-2 border-t">
       <Button 
         onClick={handleGuardarPersona}
         className="bg-green-600 hover:bg-green-700 text-white font-medium h-8 px-4 text-sm"
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
             Se {isEdit ? 'actualizará' : 'enviará'} la información de la persona a la base de datos. Esta acción no se puede deshacer.
           </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
           <AlertDialogCancel>No, editar datos</AlertDialogCancel>
           <AlertDialogAction 
             onClick={handleConfirmRegistrarPersona}
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
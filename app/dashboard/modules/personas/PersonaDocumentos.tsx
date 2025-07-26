// app/dashboard/modules/personas/PersonaDocumentos.tsx
"use client"

import { useState, useRef } from "react"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Upload, FileCheck, XCircle, AlertCircle } from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PersonaDocumentosProps {
  idSolicitud: string;
  idPersona: string;
  onClose: () => void;
}

export default function PersonaDocumentos({ 
  idSolicitud, 
  idPersona,
  onClose 
}: PersonaDocumentosProps) {
  // Estado para el formulario de documentos
  const [tipoDocumento, setTipoDocumento] = useState<string>("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{tipo: 'success' | 'error' | 'info'; texto: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estado para documentos subidos
  const [documentosSubidos, setDocumentosSubidos] = useState<{tipo: string; nombre: string}[]>([]);

  // API URL y token de autenticación
  const API_URL = "https://prod-28.brazilsouth.logic.azure.com:443/workflows/6a32dde923554f13a0667c11a705604e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=IZv3OY7jDgx6vzC1-5e2KSmrw7lw3KYg4ebvE4WIxcQ";
  const AUTH_TOKEN = "0ocrxlf--IQEPIT*PQ-VRV#F5B-8AUYABP&";

  // Manejar selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  // Manejar envío de documento
  const handleSubirDocumento = async () => {
    // Validaciones
    if (!tipoDocumento) {
      setMensaje({tipo: 'error', texto: 'Por favor seleccione un tipo de documento'});
      return;
    }
    
    if (!archivo) {
      setMensaje({tipo: 'error', texto: 'Por favor seleccione un archivo'});
      return;
    }
    
    // Preparar datos para envío
    setLoading(true);
    setMensaje(null);
    
    try {
      // Convertir archivo a base64
      const base64String = await convertFileToBase64(archivo);
      
      // Preparar datos para la API
      const datos = {
        id_solicitud: idSolicitud,
        id_persona: idPersona,
        tipo_documento: tipoDocumento,
        archivoNombre: archivo.name,
        archivoBase64: base64String
      };
      
      // Enviar a la API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": AUTH_TOKEN
        },
        body: JSON.stringify(datos)
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        // Agregar documento a la lista de subidos
        setDocumentosSubidos(prev => [...prev, {
          tipo: tipoDocumento,
          nombre: archivo.name
        }]);
        
        // Resetear formulario
        setTipoDocumento("");
        setArchivo(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        setMensaje({
          tipo: 'success', 
          texto: `Documento "${tipoDocumento}" subido correctamente`
        });
      } else {
        throw new Error(responseData.message || 'Error al subir el documento');
      }
    } catch (error) {
      console.error("Error al subir documento:", error);
      setMensaje({
        tipo: 'error', 
        texto: error instanceof Error ? error.message : 'Error al subir el documento'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Función para convertir archivo a base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Extraer solo la parte base64 sin el prefijo (data:application/pdf;base64,)
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Error al convertir archivo a Base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
      <DialogHeader className="pb-2">
        <DialogTitle>Documentos de la persona</DialogTitle>
      </DialogHeader>
      
      <div className="mt-3 space-y-3">
        {/* Mensaje de información inicial */}
        <Alert className="bg-blue-50 border-blue-200 py-2">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700 text-sm">
            Por favor suba los documentos requeridos para la persona (ARL, EPS, AFP, etc.)
          </AlertDescription>
        </Alert>
        
        {/* Formulario de carga */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="tipo-documento" className="text-xs">Tipo de documento</Label>
            <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
              <SelectTrigger id="tipo-documento" className="w-full h-8 text-sm">
                <SelectValue placeholder="Seleccione tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ARL">ARL</SelectItem>
                <SelectItem value="EPS">EPS</SelectItem>
                <SelectItem value="AFP">AFP</SelectItem>
                <SelectItem value="Cert. Espacios Confinado">Cert. Espacios Confinado</SelectItem>
                <SelectItem value="Cert. Trabajo en Alturas">Cert. Trabajo en Alturas</SelectItem>
                <SelectItem value="Concepto médico">Concepto médico</SelectItem>
                <SelectItem value="Documento de identidad">Documento de identidad</SelectItem>
                <SelectItem value="Licencia de conducción">Licencia de conducción</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="archivo" className="text-xs">Seleccionar archivo (.pdf, .jpg, .png)</Label>
            <Input 
              ref={fileInputRef}
              id="archivo" 
              type="file" 
              accept=".pdf,.jpg,.png,.jpeg" 
              onChange={handleFileChange}
              className="h-8 text-sm py-1"
            />
          </div>
        </div>
        
        {/* Botón de carga */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSubirDocumento}
            disabled={loading || !tipoDocumento || !archivo}
            className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-3 h-3 mr-1.5" />
                Subir documento
              </>
            )}
          </Button>
        </div>
        
        {/* Mensaje de resultado */}
        {mensaje && (
          <Alert className={`py-2 ${
            mensaje.tipo === 'success' ? 'bg-green-50 border-green-200' : 
            mensaje.tipo === 'error' ? 'bg-red-50 border-red-200' : 
            'bg-blue-50 border-blue-200'
          }`}>
            {mensaje.tipo === 'success' ? (
              <FileCheck className="h-4 w-4 text-green-600" />
            ) : mensaje.tipo === 'error' ? (
              <XCircle className="h-4 w-4 text-red-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-blue-600" />
            )}
            <AlertDescription className={`text-sm ${
              mensaje.tipo === 'success' ? 'text-green-700' : 
              mensaje.tipo === 'error' ? 'text-red-700' : 
              'text-blue-700'
            }`}>
              {mensaje.texto}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Lista de documentos subidos */}
        {documentosSubidos.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Documentos subidos:</h3>
            <div className="bg-gray-50 rounded-md p-2 border border-gray-200 max-h-32 overflow-y-auto">
              <ul className="space-y-1">
                {documentosSubidos.map((doc, index) => (
                  <li key={index} className="flex items-center text-xs">
                    <FileCheck className="w-3 h-3 mr-1.5 text-green-600" />
                    <span className="font-medium">{doc.tipo}:</span>
                    <span className="ml-1 text-gray-600 truncate">{doc.nombre}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Botones de acción */}
        <div className="flex justify-end pt-3 border-t mt-4">
          <Button 
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white h-8 px-4 text-sm"
          >
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  )
}
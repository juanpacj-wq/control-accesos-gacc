// app/dashboard/types.tsx

// Interfaces para las personas
export interface PersonaRegistro {
  Title?: string;
  Nombre: string;
  Apellidos: string;
  C_x002e_C: string; // Cédula
  Cargo: string;
  empresa: string;
  Estado?: string;
  ESTADO_ACTIVIDAD?: string;
}

// Datos del formulario de persona
export interface PersonaFormData {
  nombre: string;
  apellidos: string;
  cedula: string;
  correo: string;
  cargo: string;
  arl: string;
  eps: string;
  afp: string;
  certificadoConfinados: string;
  certificadoAltura: string;
  conceptoAltura: string;
  conceptoIngreso: string;
}

// Interfaces para los vehículos
export interface VehiculoRegistro {
  placa: string;
  marca: string;
  modelo: string;
  conductores: string;
  estado: string;
  color?: string;
}

// Datos que vienen de la API para vehículos
export interface VehiculoResponse {
  PLACA: string;
  MARCA: string;
  MODELO: string;
  CONDUCTORES: string;
  ESTADO: string;
}

// Datos del formulario de vehículo
export interface VehiculoFormData {
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  conductores: string;
}

// Interfaz para datos de documentos de personas
export interface DocumentoData {
  id_solicitud: string;
  id_persona: string;
  tipo_documento: string;
  archivoNombre: string;
  archivoBase64: string;
}

// Interfaz para datos de documentos de vehículos
export interface DocumentoVehiculoData {
  id_solicitud: string;
  id_vehiculo: string;
  tipo_documento: string;
  archivoNombre: string;
  archivoBase64: string;
}

// URLs de los servicios
export const API_URLS = {
  FLOW_URL_PERSONAS: "https://prod-04.brazilsouth.logic.azure.com:443/workflows/72068c61b153434a9871b7e500b0b3ec/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lZMfxADdl1xqyb_Pa0O5dVxJqgHH3rrLFI71L3zj0EU",
  FLOW_URL_VEHICULOS: "https://prod-13.brazilsouth.logic.azure.com:443/workflows/8f2e23ec9fd54e168c8c408b53d93b92/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=A_mbfDFPl0FugEHIuW8h7vKoUgxVPmaRB2Ui5Ynmjjs",
  FLOW_URL_REGISTER_PERSONA: "https://prod-06.brazilsouth.logic.azure.com:443/workflows/840563c3bc01489785603ad0d332da63/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=YT-ycbHeeB11cHLh5IckHxMbBLMBQXXPWKG4_H9jqe0",
  FLOW_URL_REGISTER_VEHICULO: "https://prod-03.brazilsouth.logic.azure.com:443/workflows/1f465d5c3cb64b46bd47dd85357cc11a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qnX5hVADuKJn-rBnOh_OinQryOjWS8gg3wS790dsY-A",
  FLOW_URL_UPLOAD_DOCUMENTO: "https://prod-28.brazilsouth.logic.azure.com:443/workflows/6a32dde923554f13a0667c11a705604e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=IZv3OY7jDgx6vzC1-5e2KSmrw7lw3KYg4ebvE4WIxcQ"
}

// Tokens de autenticación
export const AUTH_TOKENS = {
  PERSONAS: "ufpjjz2-CDZLO##*XHW-CWGOHQ-U9MXWRKB",
  VEHICULOS: "ddzy9e2-XFCNDCXIOS-FP**SID-9C2DTUUY",
  REGISTER_PERSONA: "7x7ibio-SJV-XDHGBF-OUQ*#MFV-Z2X3JPUS",
  REGISTER_VEHICULO: "mf5kk8g-AXGDNAODID-UB-NMG-N*TPQ3*8",
  UPLOAD_DOCUMENTO: "0ocrxlf--IQEPIT*PQ-VRV#F5B-8AUYABP&"
}

// Tipos de documentos para personas y vehículos
export const DOCUMENT_TYPES = {
  PERSONA: [
    "ARL",
    "EPS",
    "AFP",
    "Cert. Espacios Confinado",
    "Cert. Trabajo en Alturas",
    "Concepto médico",
    "Documento de identidad",
    "Licencia de conducción",
  ],
  VEHICULO: [
    "SOAT",
    "Póliza todo riesgo",
    "RUNT",
    "TARJETA DE PROPIEDAD",
    "Revisión técnico mecánica",
    "Licencia de tránsito"
  ]
}

// Tipo de ingreso
export type TipoIngreso = "persona" | "vehiculo";
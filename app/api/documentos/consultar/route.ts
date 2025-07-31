// app/api/documentos/consultar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerApiCredentials } from '@/lib/api-tokens';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_solicitud, id_persona } = body;

    // Validar campos requeridos
    if (!id_solicitud || !id_persona) {
      return NextResponse.json(
        { error: true, message: 'ID de solicitud e ID de persona son requeridos' },
        { status: 400 }
      );
    }

    // Obtener las credenciales del servidor
    const { url, token } = getServerApiCredentials('VER_ADJUNTOS');

    if (!url || !token) {
      console.error('Credenciales de API no configuradas para VER_ADJUNTOS');
      return NextResponse.json(
        { error: true, message: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    // Hacer la petición al servicio externo
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify({
        id_solicitud,
        id_persona
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: true, 
          message: data.mensaje || 'Error al consultar documentos' 
        },
        { status: response.status }
      );
    }

    // Transformar la respuesta si es necesario
    // Asumiendo que la respuesta viene con una estructura similar a la del HTML de ejemplo
    if (data.Datos && Array.isArray(data.Datos)) {
      // Los datos ya vienen en el formato correcto con content (base64), name, y tipo_adjunto
      return NextResponse.json({
        success: true,
        documentos: data.Datos
      });
    }

    return NextResponse.json({
      success: true,
      documentos: []
    });

  } catch (error) {
    console.error('Error en el endpoint de consultar documentos:', error);
    return NextResponse.json(
      { 
        error: true, 
        message: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}
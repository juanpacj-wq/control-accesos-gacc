// app/dashboard/modules/vehiculos/VehiculoTable.tsx
"use client"

import { Loader2, Edit, FileText } from "lucide-react"
import { VehiculoRegistro } from "../../types"
import { VehiculoStatusBadge, ConductoresInfo } from "../utils/StatusBadges"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface VehiculoTableProps {
  vehiculos: VehiculoRegistro[];
  loading: boolean;
  filtroNombre: string;
  filtroEstado: string;
}

export default function VehiculoTable({ 
  vehiculos, 
  loading, 
  filtroNombre, 
  filtroEstado 
}: VehiculoTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 font-medium border-b sticky top-0 h-2">
            <tr>
              <th className="px-4 py-1.5 text-left text-xs">Placa</th>
              <th className="px-4 py-1.5 text-left text-xs">Marca</th>
              <th className="px-4 py-1.5 text-left text-xs">Modelo</th>
              <th className="px-4 py-1.5 text-left text-xs">Conductores</th>
              <th className="px-4 py-1.5 text-left text-xs">Estado</th>
              <th className="px-4 py-1.5 text-center text-xs">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  <span className="text-gray-500">Cargando vehículos...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  // Aplicar filtros a los vehículos
  const vehiculosFiltrados = vehiculos.filter(vehiculo => {
    // Filtro por placa o marca
    const nombreMatch = !filtroNombre || 
      vehiculo.placa?.toLowerCase().includes(filtroNombre.toLowerCase()) ||
      vehiculo.marca?.toLowerCase().includes(filtroNombre.toLowerCase());
    
    // Filtro por estado
    let estadoMatch = true;
    if (filtroEstado !== "todos") {
      if (filtroEstado === "APROBADO") {
        estadoMatch = vehiculo.estado === "APROBADO";
      } else if (filtroEstado === "PENDIENTE") {
        estadoMatch = vehiculo.estado !== "APROBADO";
      }
    }
    
    return nombreMatch && estadoMatch;
  });

  if (vehiculosFiltrados.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 font-medium border-b sticky top-0 h-2">
            <tr>
              <th className="px-4 py-1.5 text-left text-xs">Placa</th>
              <th className="px-4 py-1.5 text-left text-xs">Marca</th>
              <th className="px-4 py-1.5 text-left text-xs">Modelo</th>
              <th className="px-4 py-1.5 text-left text-xs">Conductores</th>
              <th className="px-4 py-1.5 text-left text-xs">Estado</th>
              <th className="px-4 py-1.5 text-center text-xs">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                {filtroNombre || filtroEstado !== "todos" 
                  ? "No se encontraron vehículos con los filtros aplicados"
                  : "No se encontraron vehículos registrados"
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm max-h-[50vh] overflow-auto">
      <div className="h-full flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b sticky top-0 h-2">
              <tr>
                <th className="px-4 py-1.5 text-left text-xs">Placa</th>
                <th className="px-4 py-1.5 text-left text-xs">Marca</th>
                <th className="px-4 py-1.5 text-left text-xs">Modelo</th>
                <th className="px-4 py-1.5 text-left text-xs">Conductores</th>
                <th className="px-4 py-1.5 text-left text-xs">Estado</th>
                <th className="px-4 py-1.5 text-center text-xs">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehiculosFiltrados.map((vehiculo, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors h-0">
                  <td className="px-4 py-2 text-sm font-medium">{vehiculo.placa}</td>
                  <td className="px-4 py-2 text-sm">{vehiculo.marca}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{vehiculo.modelo}</td>
                  <td className="px-4 py-2">
                    <ConductoresInfo conductores={vehiculo.conductores} />
                  </td>
                  <td className="px-4 py-2">
                    <VehiculoStatusBadge estado={vehiculo.estado} />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex gap-1 justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="text-xs">Editar vehículo</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Documentos</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="text-xs">Ver documentos</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
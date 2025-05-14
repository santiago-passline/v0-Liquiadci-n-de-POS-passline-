"use client"

import { useClientContext } from "@/context/client-context"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import Navbar from "@/components/navbar"

export default function LiquidacionesPage() {
  const { liquidationHistory } = useClientContext()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-6 px-4 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Historial de Liquidaciones</CardTitle>
            <CardDescription>Visualice todas las liquidaciones generadas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha de Liquidación</TableHead>
                  <TableHead>Fecha de Generación</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liquidationHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      No hay liquidaciones registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  liquidationHistory.map((liquidation) => (
                    <TableRow key={liquidation.id}>
                      <TableCell className="font-medium">{liquidation.id}</TableCell>
                      <TableCell>{liquidation.client?.name}</TableCell>
                      <TableCell>{liquidation.liquidationDate}</TableCell>
                      <TableCell>{format(new Date(liquidation.generationDate), "yyyy-MM-dd HH:mm")}</TableCell>
                      <TableCell className="font-medium">${liquidation.liquidationAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/liquidaciones/${liquidation.id}`}>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Ver Detalle
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {liquidationHistory.length === 0 && (
              <div className="mt-6 text-center">
                <Link href="/">
                  <Button className="bg-[#F7B928] hover:bg-[#e5aa25] text-black">Crear Nueva Liquidación</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

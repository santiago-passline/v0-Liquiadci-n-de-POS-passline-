"use client"

import { useClientContext } from "@/context/client-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { format } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"

// Add the missing type for jsPDF
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export default function LiquidacionDetailPage() {
  const { liquidationHistory } = useClientContext()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const liquidationId = params.id as string
  const liquidation = liquidationHistory.find((l) => l.id === liquidationId)

  const handleGeneratePDF = () => {
    if (!liquidation) return

    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text("Reporte de Liquidación POS", 105, 15, { align: "center" })

    // Add metadata
    doc.setFontSize(11)
    doc.text(`ID de Liquidación: ${liquidation.id}`, 14, 30)
    doc.text(`Usuario: ${liquidation.user}`, 14, 37)
    doc.text(`Cliente: ${liquidation.client?.name} (ID: ${liquidation.client?.id})`, 14, 44)
    doc.text(`Fecha de Liquidación: ${liquidation.liquidationDate}`, 14, 51)
    doc.text(`Fecha de Generación: ${format(new Date(liquidation.generationDate), "yyyy-MM-dd HH:mm:ss")}`, 14, 58)

    // Add POS details
    doc.setFontSize(14)
    doc.text("Detalles de POS", 14, 70)

    const tableData = liquidation.posEntries.map((pos) => [pos.id, `$${pos.billing.toFixed(2)}`])

    doc.autoTable({
      startY: 75,
      head: [["ID de POS", "Monto de Facturación"]],
      body: tableData,
    })

    // Add summary
    const finalY = (doc as any).lastAutoTable.finalY + 10

    doc.setFontSize(11)
    doc.text(`Facturación Total: $${liquidation.totalBilling.toFixed(2)}`, 14, finalY)
    doc.text(`Arriendo Total: $${liquidation.totalRental.toFixed(2)}`, 14, finalY + 7)
    doc.text(`Comisión Total: $${liquidation.totalCommission.toFixed(2)}`, 14, finalY + 14)
    doc.text(`Costo de Transferencia: $${liquidation.transferCost.toFixed(2)}`, 14, finalY + 21)

    let currentY = finalY + 28

    // Add other cost if it exists
    if (liquidation.otherCost) {
      doc.text(`${liquidation.otherCost.description}: $${liquidation.otherCost.amount.toFixed(2)}`, 14, currentY)
      currentY += 7
    }

    doc.text(`IVA (22%): $${liquidation.iva.toFixed(2)}`, 14, currentY)
    currentY += 7

    doc.setFontSize(12)
    doc.text(`Costos Totales: $${liquidation.totalCost.toFixed(2)}`, 14, currentY + 3)
    currentY += 10

    doc.setFontSize(14)
    doc.setTextColor(0, 100, 0)
    doc.text(`MONTO TOTAL DE LIQUIDACIÓN: $${liquidation.liquidationAmount.toFixed(2)}`, 14, currentY + 3)

    // Save the PDF
    doc.save(`liquidacion_${liquidation.id}.pdf`)

    toast({
      title: "Éxito",
      description: "PDF generado exitosamente",
    })
  }

  if (!liquidation) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-6 px-4 flex-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-40 space-y-4">
                <FileText className="h-12 w-12 text-gray-400" />
                <p className="text-gray-500">Liquidación no encontrada</p>
                <Button variant="outline" onClick={() => router.push("/liquidaciones")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Liquidaciones
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-6 px-4 flex-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Detalle de Liquidación</CardTitle>
              <CardDescription>
                ID: {liquidation.id} | Generado: {format(new Date(liquidation.generationDate), "yyyy-MM-dd")}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => router.push("/liquidaciones")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-gray-50 space-y-2">
                <h3 className="font-medium">Información del Cliente</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-sm text-gray-500">Cliente:</p>
                  <p className="text-sm font-medium">{liquidation.client?.name}</p>

                  <p className="text-sm text-gray-500">ID de Cliente:</p>
                  <p className="text-sm font-medium">{liquidation.client?.id}</p>

                  <p className="text-sm text-gray-500">Fecha de Liquidación:</p>
                  <p className="text-sm font-medium">{liquidation.liquidationDate}</p>

                  <p className="text-sm text-gray-500">Usuario:</p>
                  <p className="text-sm font-medium">{liquidation.user}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Equipos POS</h3>
                <div className="border rounded-md divide-y">
                  {liquidation.posEntries.map((pos) => (
                    <div key={pos.id} className="flex justify-between p-3">
                      <span>POS {pos.id}</span>
                      <span className="font-medium">${pos.billing.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between p-3 bg-gray-50">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">${liquidation.totalBilling.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Resumen de Facturación</h3>
                  <div className="p-3 border rounded-md space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total POS:</span>
                      <span>{liquidation.posEntries.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Facturación Total:</span>
                      <span className="font-medium">${liquidation.totalBilling.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Resumen de Costos</h3>
                  <div className="p-3 border rounded-md space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Arriendo Total:</span>
                      <span>${liquidation.totalRental.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Comisión Total:</span>
                      <span>${liquidation.totalCommission.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Costo de Transferencia:</span>
                      <span>${liquidation.transferCost.toFixed(2)}</span>
                    </div>

                    {liquidation.otherCost && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">{liquidation.otherCost.description}:</span>
                        <span>${liquidation.otherCost.amount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">IVA (22%):</span>
                      <span>${liquidation.iva.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Costos Totales:</span>
                      <span>${liquidation.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-[#F7B928]/10 text-black space-y-2">
                <h3 className="font-medium">Monto Final de Liquidación</h3>
                <p className="text-2xl font-bold text-center">${liquidation.liquidationAmount.toFixed(2)}</p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleGeneratePDF}
                  className="w-full flex items-center justify-center gap-2 bg-[#F7B928] hover:bg-[#e5aa25] text-black"
                >
                  <Download className="h-4 w-4" />
                  Generar PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

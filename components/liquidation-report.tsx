"use client"

import { useClientContext } from "@/context/client-context"
import { Button } from "@/components/ui/button"
import { Download, FileText, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { useToast } from "@/hooks/use-toast"

// Add the missing type for jsPDF
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export default function LiquidationReport() {
  const { liquidationData, resetLiquidation } = useClientContext()
  const { toast } = useToast()

  const handleGeneratePDF = () => {
    if (!liquidationData) return

    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text("Reporte de Liquidación POS", 105, 15, { align: "center" })

    // Add metadata
    doc.setFontSize(11)
    doc.text(`ID de Liquidación: ${liquidationData.id}`, 14, 30)
    doc.text(`Usuario: ${liquidationData.user}`, 14, 37)
    doc.text(`Cliente: ${liquidationData.client?.name} (ID: ${liquidationData.client?.id})`, 14, 44)
    doc.text(`Fecha de Liquidación: ${liquidationData.liquidationDate}`, 14, 51)
    doc.text(`Fecha de Generación: ${format(new Date(liquidationData.generationDate), "yyyy-MM-dd HH:mm:ss")}`, 14, 58)

    // Add POS details
    doc.setFontSize(14)
    doc.text("Detalles de POS", 14, 70)

    const tableData = liquidationData.posEntries.map((pos) => [pos.id, `$${pos.billing.toFixed(2)}`])

    doc.autoTable({
      startY: 75,
      head: [["ID de POS", "Monto de Facturación"]],
      body: tableData,
    })

    // Add summary
    const finalY = (doc as any).lastAutoTable.finalY + 10

    doc.setFontSize(11)
    doc.text(`Facturación Total: $${liquidationData.totalBilling.toFixed(2)}`, 14, finalY)
    doc.text(`Arriendo Total: $${liquidationData.totalRental.toFixed(2)}`, 14, finalY + 7)
    doc.text(`Comisión Total: $${liquidationData.totalCommission.toFixed(2)}`, 14, finalY + 14)
    doc.text(`Costo de Transferencia: $${liquidationData.transferCost.toFixed(2)}`, 14, finalY + 21)

    let currentY = finalY + 28

    // Add other cost if it exists
    if (liquidationData.otherCost) {
      doc.text(
        `${liquidationData.otherCost.description}: $${liquidationData.otherCost.amount.toFixed(2)}`,
        14,
        currentY,
      )
      currentY += 7
    }

    doc.text(`IVA (22%): $${liquidationData.iva.toFixed(2)}`, 14, currentY)
    currentY += 7

    doc.setFontSize(12)
    doc.text(`Costos Totales: $${liquidationData.totalCost.toFixed(2)}`, 14, currentY + 3)
    currentY += 10

    doc.setFontSize(14)
    doc.setTextColor(0, 100, 0)
    doc.text(`MONTO TOTAL DE LIQUIDACIÓN: $${liquidationData.liquidationAmount.toFixed(2)}`, 14, currentY + 3)

    // Save the PDF
    doc.save(`liquidacion_${liquidationData.id}.pdf`)

    toast({
      title: "Éxito",
      description: "PDF generado exitosamente",
    })
  }

  const handleReset = () => {
    resetLiquidation()
    toast({
      title: "Reinicio",
      description: "Los datos de liquidación han sido reiniciados",
    })
  }

  if (!liquidationData) {
    return (
      <div className="flex flex-col items-center justify-center h-40 space-y-4">
        <FileText className="h-12 w-12 text-gray-400" />
        <p className="text-gray-500">No hay datos de liquidación disponibles. Por favor complete el cálculo primero.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Reporte de Liquidación</h2>
      <p className="text-sm text-gray-500">
        ID: {liquidationData.id} | Generado: {format(new Date(liquidationData.generationDate), "yyyy-MM-dd")}
      </p>

      <div className="space-y-4">
        <div className="p-4 border rounded-md bg-gray-50 space-y-2">
          <h3 className="font-medium">Información del Cliente</h3>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-sm text-gray-500">Cliente:</p>
            <p className="text-sm font-medium">{liquidationData.client?.name}</p>

            <p className="text-sm text-gray-500">ID de Cliente:</p>
            <p className="text-sm font-medium">{liquidationData.client?.id}</p>

            <p className="text-sm text-gray-500">Fecha de Liquidación:</p>
            <p className="text-sm font-medium">{liquidationData.liquidationDate}</p>

            <p className="text-sm text-gray-500">Usuario:</p>
            <p className="text-sm font-medium">{liquidationData.user}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Equipos POS</h3>
          <div className="border rounded-md divide-y">
            {liquidationData.posEntries.map((pos) => (
              <div key={pos.id} className="flex justify-between p-3">
                <span>POS {pos.id}</span>
                <span className="font-medium">${pos.billing.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between p-3 bg-gray-50">
              <span className="font-medium">Total</span>
              <span className="font-bold">${liquidationData.totalBilling.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">Resumen de Facturación</h3>
            <div className="p-3 border rounded-md space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total POS:</span>
                <span>{liquidationData.posEntries.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Facturación Total:</span>
                <span className="font-medium">${liquidationData.totalBilling.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Resumen de Costos</h3>
            <div className="p-3 border rounded-md space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Arriendo Total:</span>
                <span>${liquidationData.totalRental.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Comisión Total:</span>
                <span>${liquidationData.totalCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Costo de Transferencia:</span>
                <span>${liquidationData.transferCost.toFixed(2)}</span>
              </div>

              {liquidationData.otherCost && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{liquidationData.otherCost.description}:</span>
                  <span>${liquidationData.otherCost.amount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">IVA (22%):</span>
                <span>${liquidationData.iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Costos Totales:</span>
                <span>${liquidationData.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-md bg-[#F7B928]/10 text-black space-y-2">
          <h3 className="font-medium">Monto Final de Liquidación</h3>
          <p className="text-2xl font-bold text-center">${liquidationData.liquidationAmount.toFixed(2)}</p>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            onClick={handleGeneratePDF}
            className="w-full flex items-center justify-center gap-2 bg-[#F7B928] hover:bg-[#e5aa25] text-black"
          >
            <Download className="h-4 w-4" />
            Generar PDF
          </Button>

          <Button variant="outline" onClick={handleReset} className="w-full flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Reiniciar
          </Button>
        </div>
      </div>
    </div>
  )
}

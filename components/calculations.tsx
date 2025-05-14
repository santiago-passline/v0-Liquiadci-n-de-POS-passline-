"use client"

import { useClientContext } from "@/context/client-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Calculator, Eye, DollarSign, Percent, Plus, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function Calculations() {
  const { selectedClient, posEntries, calculateLiquidation, otherCost, setOtherCost, clearOtherCost } =
    useClientContext()
  const [rentalFee, setRentalFee] = useState<number | undefined>(undefined)
  const [commissionRate, setCommissionRate] = useState<number | undefined>(undefined)
  const [otherCostDescription, setOtherCostDescription] = useState<string>(otherCost?.description || "")
  const [otherCostAmount, setOtherCostAmount] = useState<string>(otherCost?.amount.toString() || "")
  const [showOtherCost, setShowOtherCost] = useState<boolean>(!!otherCost)
  const { toast } = useToast()

  const handlePreview = () => {
    if (!selectedClient) {
      toast({
        title: "Error",
        description: "Por favor seleccione un cliente primero",
        variant: "destructive",
      })
      return
    }

    if (posEntries.length === 0) {
      toast({
        title: "Error",
        description: "Por favor agregue al menos un POS",
        variant: "destructive",
      })
      return
    }

    // Handle other cost
    if (showOtherCost && otherCostDescription && otherCostAmount) {
      setOtherCost(otherCostDescription, Number.parseFloat(otherCostAmount))
    } else {
      clearOtherCost()
    }

    const totalBilling = posEntries.reduce((sum, pos) => sum + pos.billing, 0)
    const fee = rentalFee !== undefined ? rentalFee : selectedClient.rentalFee
    const rate = commissionRate !== undefined ? commissionRate : selectedClient.commissionRate

    const totalRental = fee * posEntries.length
    const totalCommission = (rate / 100) * totalBilling
    const transferCost = 70

    // Include other cost if it exists
    const otherCostValue = showOtherCost && otherCostAmount ? Number.parseFloat(otherCostAmount) : 0

    const subtotal = totalRental + totalCommission + transferCost + otherCostValue
    const iva = 0.22 * subtotal
    const totalCost = subtotal + iva
    const liquidationAmount = totalBilling - totalCost

    toast({
      title: "Vista Previa de Cálculo",
      description: (
        <div className="space-y-1 mt-2">
          <p>Facturación Total: ${totalBilling.toFixed(2)}</p>
          <p>Arriendo Total: ${totalRental.toFixed(2)}</p>
          <p>Comisión Total: ${totalCommission.toFixed(2)}</p>
          <p>Costo de Transferencia: $70.00</p>
          {otherCostValue > 0 && (
            <p>
              {otherCostDescription}: ${otherCostValue.toFixed(2)}
            </p>
          )}
          <p>IVA (22%): ${iva.toFixed(2)}</p>
          <p>Costo Total: ${totalCost.toFixed(2)}</p>
          <p className="font-bold">Monto de Liquidación: ${liquidationAmount.toFixed(2)}</p>
        </div>
      ),
      duration: 10000,
    })
  }

  const handleCalculate = () => {
    if (!selectedClient) {
      toast({
        title: "Error",
        description: "Por favor seleccione un cliente primero",
        variant: "destructive",
      })
      return
    }

    if (posEntries.length === 0) {
      toast({
        title: "Error",
        description: "Por favor agregue al menos un POS",
        variant: "destructive",
      })
      return
    }

    // Update client values if changed
    if (rentalFee !== undefined) {
      selectedClient.rentalFee = rentalFee
    }

    if (commissionRate !== undefined) {
      selectedClient.commissionRate = commissionRate
    }

    // Handle other cost
    if (showOtherCost && otherCostDescription && otherCostAmount) {
      setOtherCost(otherCostDescription, Number.parseFloat(otherCostAmount))
    } else {
      clearOtherCost()
    }

    calculateLiquidation()

    toast({
      title: "Éxito",
      description: "Liquidación calculada exitosamente",
    })
  }

  const toggleOtherCost = () => {
    setShowOtherCost(!showOtherCost)
    if (!showOtherCost) {
      setOtherCostDescription("")
      setOtherCostAmount("")
      clearOtherCost()
    }
  }

  if (!selectedClient) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">Por favor seleccione un cliente primero</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Cálculos</h2>
      <p className="text-sm text-gray-500">Confirme valores y calcule la liquidación</p>

      <div className="space-y-4 p-4 border rounded-md bg-gray-50">
        <h3 className="font-medium">Parámetros de Cálculo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Arriendo por POS</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="number"
                placeholder={`Predeterminado: ${selectedClient.rentalFee}`}
                value={rentalFee !== undefined ? rentalFee : ""}
                onChange={(e) => setRentalFee(e.target.value ? Number.parseFloat(e.target.value) : undefined)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tasa de Comisión (%)</label>
            <div className="relative">
              <Percent className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="number"
                placeholder={`Predeterminado: ${selectedClient.commissionRate}`}
                value={commissionRate !== undefined ? commissionRate : ""}
                onChange={(e) => setCommissionRate(e.target.value ? Number.parseFloat(e.target.value) : undefined)}
                className="pl-8"
              />
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <h3 className="font-medium">Otros Costos</h3>
          <Button variant="ghost" size="sm" onClick={toggleOtherCost} className="h-8 px-2">
            {showOtherCost ? <X className="h-4 w-4 text-gray-500" /> : <Plus className="h-4 w-4 text-gray-500" />}
          </Button>
        </div>

        {showOtherCost && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Input
                placeholder="Ej: Mantenimiento"
                value={otherCostDescription}
                onChange={(e) => setOtherCostDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Importe</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={otherCostAmount}
                  onChange={(e) => setOtherCostAmount(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border rounded-md bg-gray-50 space-y-2">
        <h3 className="font-medium">Resumen</h3>
        <div className="grid grid-cols-2 gap-2">
          <p className="text-sm text-gray-500">Cliente:</p>
          <p className="text-sm font-medium">{selectedClient.name}</p>

          <p className="text-sm text-gray-500">Total POS:</p>
          <p className="text-sm font-medium">{posEntries.length}</p>

          <p className="text-sm text-gray-500">Facturación Total:</p>
          <p className="text-sm font-medium">${posEntries.reduce((sum, pos) => sum + pos.billing, 0).toFixed(2)}</p>

          <p className="text-sm text-gray-500">Arriendo por POS:</p>
          <p className="text-sm font-medium">
            ${(rentalFee !== undefined ? rentalFee : selectedClient.rentalFee).toFixed(2)}
          </p>

          <p className="text-sm text-gray-500">Tasa de Comisión:</p>
          <p className="text-sm font-medium">
            {(commissionRate !== undefined ? commissionRate : selectedClient.commissionRate).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Button variant="outline" onClick={handlePreview} className="w-full flex items-center justify-center gap-2">
          <Eye className="h-4 w-4" />
          Vista Previa
        </Button>

        <Button
          onClick={handleCalculate}
          className="w-full flex items-center justify-center gap-2 bg-[#F7B928] hover:bg-[#e5aa25] text-black"
        >
          <Calculator className="h-4 w-4" />
          Calcular Liquidación
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useClientContext } from "@/context/client-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function POSManagement() {
  const { selectedClient, posEntries, addPOS, updatePOS, removePOS } = useClientContext()
  const [newPosId, setNewPosId] = useState("")
  const [newPosBilling, setNewPosBilling] = useState("")
  const { toast } = useToast()

  const handleAddPOS = () => {
    if (!newPosId) {
      toast({
        title: "Error",
        description: "Se requiere ID de POS",
        variant: "destructive",
      })
      return
    }

    const billing = Number.parseFloat(newPosBilling) || 0

    // Check if POS already exists
    if (posEntries.some((pos) => pos.id === newPosId)) {
      toast({
        title: "Error",
        description: "El ID de POS ya existe",
        variant: "destructive",
      })
      return
    }

    addPOS({ id: newPosId, billing })
    setNewPosId("")
    setNewPosBilling("")

    toast({
      title: "Éxito",
      description: `POS ${newPosId} agregado con facturación $${billing.toFixed(2)}`,
    })
  }

  const handleUpdateBilling = (id: string, value: string) => {
    const billing = Number.parseFloat(value) || 0
    updatePOS(id, billing)
  }

  const handleRemovePOS = (id: string) => {
    removePOS(id)
    toast({
      title: "Éxito",
      description: `POS ${id} eliminado`,
    })
  }

  const totalBilling = posEntries.reduce((sum, pos) => sum + pos.billing, 0)

  if (!selectedClient) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">Por favor seleccione un cliente primero</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gestión de POS</h2>
      <p className="text-sm text-gray-500">
        Cliente: {selectedClient.name} | Total POS: {posEntries.length} | Facturación Total: ${totalBilling.toFixed(2)}
      </p>

      <div className="space-y-4 p-4 border rounded-md bg-gray-50">
        <h3 className="font-medium">Agregar Nuevo POS</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ID de POS</label>
              <Input placeholder="Ingresar ID de POS" value={newPosId} onChange={(e) => setNewPosId(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Monto de Facturación</label>
              <Input
                placeholder="Ingresar monto"
                type="number"
                value={newPosBilling}
                onChange={(e) => setNewPosBilling(e.target.value)}
                className="relative"
                icon={<DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />}
                style={{ paddingLeft: "2rem" }}
              />
            </div>
          </div>

          <Button
            onClick={handleAddPOS}
            className="w-full flex items-center justify-center gap-2 bg-[#F7B928] hover:bg-[#e5aa25] text-black"
          >
            <Plus className="h-4 w-4" />
            Agregar POS
          </Button>
        </div>
      </div>

      {posEntries.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="font-medium">Equipos POS</h3>

          <Accordion type="single" collapsible className="w-full">
            {posEntries.map((pos, index) => (
              <AccordionItem key={pos.id} value={pos.id} className="border rounded-md mb-2 overflow-hidden">
                <AccordionTrigger className="hover:no-underline px-4 py-3">
                  <div className="flex justify-between w-full pr-4">
                    <span className="font-medium">POS {pos.id}</span>
                    <span className="font-bold">${pos.billing.toFixed(2)}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-gray-50">
                  <div className="flex items-center gap-2 p-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-1 block">Monto de Facturación</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="number"
                          value={pos.billing || ""}
                          onChange={(e) => handleUpdateBilling(pos.id, e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => handleRemovePOS(pos.id)} className="mt-6">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {posEntries.length > 0 && (
        <div className="p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Resumen</p>
              <p className="text-sm text-gray-500">Total POS: {posEntries.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Facturación Total:</p>
              <p className="text-xl font-bold">${totalBilling.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

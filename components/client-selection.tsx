"use client"

import { useState } from "react"
import { useClientContext } from "@/context/client-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ClientSelection() {
  const { clients, selectClient, setLiquidationDate } = useClientContext()
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [message, setMessage] = useState<string>("")

  const handleClientSelect = (value: string) => {
    setSelectedClientId(value)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)
  }

  const handleContinue = () => {
    if (!selectedClientId) {
      setMessage("Por favor seleccione un cliente")
      return
    }

    if (!date) {
      setMessage("Por favor seleccione una fecha de liquidación")
      return
    }

    const client = clients.find((c) => c.id === selectedClientId)
    if (client) {
      selectClient(client)
      setLiquidationDate(format(date, "yyyy-MM-dd"))
      setMessage(`Cliente ${client.name} seleccionado con fecha de liquidación ${format(date, "yyyy-MM-dd")}`)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Selección de Cliente</h2>
      <p className="text-sm text-gray-500">Seleccione un cliente y fecha de liquidación</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Cliente</label>
          <Select onValueChange={handleClientSelect} value={selectedClientId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha de Liquidación</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {selectedClientId && (
          <div className="space-y-2 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium">Detalles del Cliente</h3>
            {clients.find((c) => c.id === selectedClientId) && (
              <>
                <p>Arriendo por POS: ${clients.find((c) => c.id === selectedClientId)?.rentalFee.toFixed(2)}</p>
                <p>Tasa de Comisión: {clients.find((c) => c.id === selectedClientId)?.commissionRate.toFixed(2)}%</p>
              </>
            )}
          </div>
        )}

        <Button onClick={handleContinue} className="w-full bg-[#F7B928] hover:bg-[#e5aa25] text-black">
          Confirmar Selección
        </Button>

        {message && (
          <div className="p-3 rounded-md bg-green-50 text-green-700 border border-green-200 flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  )
}

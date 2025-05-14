"use client"

import { useClientContext } from "@/context/client-context"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowDownToLine, ArrowUpFromLine, Archive } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"

export default function EquiposPOSPage() {
  const { clients, posEquipment, changePOSStatus } = useClientContext()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [newPosId, setNewPosId] = useState("")
  const [newPosLocation, setNewPosLocation] = useState<"client" | "available" | "unavailable" | "archived">("available")
  const [newPosClientId, setNewPosClientId] = useState("")
  const [selectedPosId, setSelectedPosId] = useState("")
  const [selectedClientId, setSelectedClientId] = useState("")
  const { toast } = useToast()

  const handleAddPOS = () => {
    toast({
      title: "Funcionalidad en desarrollo",
      description: "La adición de nuevos equipos POS estará disponible próximamente",
    })
    setIsAddDialogOpen(false)
  }

  const handleAssignPOS = () => {
    if (!selectedClientId) {
      toast({
        title: "Error",
        description: "Por favor seleccione un cliente",
        variant: "destructive",
      })
      return
    }

    changePOSStatus(selectedPosId, "client", selectedClientId)
    setIsAssignDialogOpen(false)
    toast({
      title: "Éxito",
      description: "POS asignado exitosamente",
    })
  }

  const handleReturnPOS = (posId: string) => {
    changePOSStatus(posId, "available")
    toast({
      title: "Éxito",
      description: "POS marcado como disponible",
    })
  }

  const handleArchivePOS = (posId: string) => {
    changePOSStatus(posId, "archived")
    toast({
      title: "Éxito",
      description: "POS archivado exitosamente",
    })
  }

  const openAssignDialog = (posId: string) => {
    setSelectedPosId(posId)
    setSelectedClientId("")
    setIsAssignDialogOpen(true)
  }

  const getLocationBadge = (location: string) => {
    switch (location) {
      case "client":
        return <Badge className="bg-[#F7B928] text-black hover:bg-[#F7B928]">En manos de cliente</Badge>
      case "available":
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Disponible</Badge>
      case "unavailable":
        return <Badge className="bg-red-500 text-white hover:bg-red-600">No disponible</Badge>
      case "archived":
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Archivado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-6 px-4 flex-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gestión de Equipos POS</CardTitle>
              <CardDescription>Administre los equipos POS del sistema</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#F7B928] hover:bg-[#e5aa25] text-black">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Equipo POS
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Equipo POS</DialogTitle>
                  <DialogDescription>Complete los datos del nuevo equipo</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ID del Equipo</label>
                    <Input
                      placeholder="Ingrese ID del equipo"
                      value={newPosId}
                      onChange={(e) => setNewPosId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estado</label>
                    <Select
                      value={newPosLocation}
                      onValueChange={(value: "client" | "available" | "unavailable" | "archived") => {
                        setNewPosLocation(value)
                        if (value !== "client") {
                          setNewPosClientId("")
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">En manos de cliente</SelectItem>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="unavailable">No disponible</SelectItem>
                        <SelectItem value="archived">Archivado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newPosLocation === "client" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cliente</label>
                      <Select value={newPosClientId} onValueChange={setNewPosClientId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione cliente" />
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
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddPOS} className="bg-[#F7B928] hover:bg-[#e5aa25] text-black">
                    Agregar Equipo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posEquipment.map((pos) => (
                  <TableRow key={pos.id}>
                    <TableCell className="font-medium">{pos.id}</TableCell>
                    <TableCell>{getLocationBadge(pos.location)}</TableCell>
                    <TableCell>{pos.location === "client" ? pos.clientName : "-"}</TableCell>
                    <TableCell className="text-right">
                      {pos.location === "client" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReturnPOS(pos.id)}
                          className="flex items-center gap-1"
                        >
                          <ArrowUpFromLine className="h-4 w-4" />
                          Retirar POS
                        </Button>
                      ) : pos.location === "available" ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAssignDialog(pos.id)}
                            className="flex items-center gap-1"
                          >
                            <ArrowDownToLine className="h-4 w-4" />
                            Entregar POS
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleArchivePOS(pos.id)}
                            className="flex items-center gap-1"
                          >
                            <Archive className="h-4 w-4" />
                            Archivar
                          </Button>
                        </div>
                      ) : pos.location === "unavailable" ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              changePOSStatus(pos.id, "available")
                              toast({
                                title: "Éxito",
                                description: "POS marcado como disponible",
                              })
                            }}
                          >
                            Marcar disponible
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleArchivePOS(pos.id)}
                            className="flex items-center gap-1"
                          >
                            <Archive className="h-4 w-4" />
                            Archivar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            changePOSStatus(pos.id, "available")
                            toast({
                              title: "Éxito",
                              description: "POS restaurado y marcado como disponible",
                            })
                          }}
                        >
                          Restaurar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Assign POS Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entregar POS a Cliente</DialogTitle>
            <DialogDescription>Seleccione el cliente al que desea entregar el POS</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ID del POS</label>
              <Input value={selectedPosId} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente</label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione cliente" />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignPOS} className="bg-[#F7B928] hover:bg-[#e5aa25] text-black">
              Entregar POS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

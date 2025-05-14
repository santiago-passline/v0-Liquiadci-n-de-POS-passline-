"use client"

import { useState } from "react"
import { useClientContext } from "@/context/client-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Eye, Mail, MapPin, Phone, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"

export default function ClientesPage() {
  const { clients, addClient, updateClient, removeClient } = useClientContext()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newClientId, setNewClientId] = useState("")
  const [newClientName, setNewClientName] = useState("")
  const [newClientRentalFee, setNewClientRentalFee] = useState("")
  const [newClientCommissionRate, setNewClientCommissionRate] = useState("")
  const [newClientPhone, setNewClientPhone] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")
  const [newClientAddress, setNewClientAddress] = useState("")
  const [editingClient, setEditingClient] = useState<{
    oldId: string
    id: string
    name: string
    rentalFee: number
    commissionRate: number
    phone?: string
    email?: string
    address?: string
  } | null>(null)
  const [viewingClient, setViewingClient] = useState<Client | null>(null)
  const { toast } = useToast()

  const handleAddClient = () => {
    if (!newClientId || !newClientName || !newClientRentalFee || !newClientCommissionRate) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios (ID, Nombre, Arriendo, Comisión)",
        variant: "destructive",
      })
      return
    }

    // Check if ID already exists
    if (clients.some((client) => client.id === newClientId)) {
      toast({
        title: "Error",
        description: "Ya existe un cliente con ese ID",
        variant: "destructive",
      })
      return
    }

    addClient(
      newClientId,
      newClientName,
      Number.parseFloat(newClientRentalFee),
      Number.parseFloat(newClientCommissionRate),
      newClientPhone || undefined,
      newClientEmail || undefined,
      newClientAddress || undefined,
    )

    setNewClientId("")
    setNewClientName("")
    setNewClientRentalFee("")
    setNewClientCommissionRate("")
    setNewClientPhone("")
    setNewClientEmail("")
    setNewClientAddress("")
    setIsAddDialogOpen(false)

    toast({
      title: "Éxito",
      description: "Cliente agregado exitosamente",
    })
  }

  const handleEditClient = () => {
    if (!editingClient || !editingClient.id || !editingClient.name) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    // Check if new ID already exists and it's not the same client
    if (editingClient.oldId !== editingClient.id && clients.some((client) => client.id === editingClient.id)) {
      toast({
        title: "Error",
        description: "Ya existe un cliente con ese ID",
        variant: "destructive",
      })
      return
    }

    updateClient(
      editingClient.oldId,
      editingClient.id,
      editingClient.name,
      editingClient.rentalFee,
      editingClient.commissionRate,
      editingClient.phone,
      editingClient.email,
      editingClient.address,
    )

    setEditingClient(null)
    setIsEditDialogOpen(false)

    toast({
      title: "Éxito",
      description: "Cliente actualizado exitosamente",
    })
  }

  const handleDeleteClient = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar este cliente?")) {
      removeClient(id)
      toast({
        title: "Éxito",
        description: "Cliente eliminado exitosamente",
      })
    }
  }

  const openEditDialog = (client: Client) => {
    setEditingClient({
      oldId: client.id,
      id: client.id,
      name: client.name,
      rentalFee: client.rentalFee,
      commissionRate: client.commissionRate,
      phone: client.phone,
      email: client.email,
      address: client.address,
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (client: Client) => {
    setViewingClient(client)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-6 px-4 flex-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gestión de Clientes</CardTitle>
              <CardDescription>Administre los clientes del sistema</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#F7B928] hover:bg-[#e5aa25] text-black">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                  <DialogDescription>Complete los datos del nuevo cliente</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ID del Cliente *</label>
                      <Input
                        placeholder="Ingrese ID del cliente"
                        value={newClientId}
                        onChange={(e) => setNewClientId(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nombre del Cliente *</label>
                      <Input
                        placeholder="Ingrese nombre del cliente"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Arriendo por POS *</label>
                      <Input
                        type="number"
                        placeholder="Ingrese monto de arriendo"
                        value={newClientRentalFee}
                        onChange={(e) => setNewClientRentalFee(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tasa de Comisión (%) *</label>
                      <Input
                        type="number"
                        placeholder="Ingrese tasa de comisión"
                        value={newClientCommissionRate}
                        onChange={(e) => setNewClientCommissionRate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Teléfono</label>
                    <Input
                      placeholder="Ingrese teléfono de contacto"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Correo Electrónico</label>
                    <Input
                      type="email"
                      placeholder="Ingrese correo electrónico"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dirección</label>
                    <Input
                      placeholder="Ingrese dirección"
                      value={newClientAddress}
                      onChange={(e) => setNewClientAddress(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddClient} className="bg-[#F7B928] hover:bg-[#e5aa25] text-black">
                    Agregar Cliente
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>Arriendo por POS</TableHead>
                  <TableHead>Tasa de Comisión</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No hay clientes registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>${client.rentalFee.toFixed(2)}</TableCell>
                      <TableCell>{client.commissionRate.toFixed(2)}%</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openViewDialog(client)}
                          className="mr-1"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(client)}
                          className="mr-1"
                          title="Editar cliente"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClient(client.id)}
                          title="Eliminar cliente"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>Modifique los datos del cliente</DialogDescription>
          </DialogHeader>
          {editingClient && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ID del Cliente *</label>
                  <Input
                    placeholder="Ingrese ID del cliente"
                    value={editingClient.id}
                    onChange={(e) => setEditingClient({ ...editingClient, id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre del Cliente *</label>
                  <Input
                    placeholder="Ingrese nombre del cliente"
                    value={editingClient.name}
                    onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Arriendo por POS *</label>
                  <Input
                    type="number"
                    placeholder="Ingrese monto de arriendo"
                    value={editingClient.rentalFee}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        rentalFee: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tasa de Comisión (%) *</label>
                  <Input
                    type="number"
                    placeholder="Ingrese tasa de comisión"
                    value={editingClient.commissionRate}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        commissionRate: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  placeholder="Ingrese teléfono de contacto"
                  value={editingClient.phone || ""}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo Electrónico</label>
                <Input
                  type="email"
                  placeholder="Ingrese correo electrónico"
                  value={editingClient.email || ""}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dirección</label>
                <Input
                  placeholder="Ingrese dirección"
                  value={editingClient.address || ""}
                  onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditClient} className="bg-[#F7B928] hover:bg-[#e5aa25] text-black">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles del Cliente</DialogTitle>
            <DialogDescription>Información completa del cliente</DialogDescription>
          </DialogHeader>
          {viewingClient && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID del Cliente</p>
                  <p className="font-medium">{viewingClient.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{viewingClient.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Arriendo por POS</p>
                  <p className="font-medium">${viewingClient.rentalFee.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tasa de Comisión</p>
                  <p className="font-medium">{viewingClient.commissionRate.toFixed(2)}%</p>
                </div>
              </div>

              {viewingClient.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a href={`tel:${viewingClient.phone}`} className="text-blue-600 hover:underline">
                    {viewingClient.phone}
                  </a>
                </div>
              )}

              {viewingClient.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a href={`mailto:${viewingClient.email}`} className="text-blue-600 hover:underline">
                    {viewingClient.email}
                  </a>
                </div>
              )}

              {viewingClient.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span>{viewingClient.address}</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
            {viewingClient && (
              <Button
                onClick={() => {
                  openEditDialog(viewingClient)
                  setIsViewDialogOpen(false)
                }}
                className="bg-[#F7B928] hover:bg-[#e5aa25] text-black"
              >
                Editar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"

export type Client = {
  id: string
  name: string
  rentalFee: number
  commissionRate: number
  phone?: string
  email?: string
  address?: string
}

export type POS = {
  id: string
  billing: number
}

export type OtherCost = {
  description: string
  amount: number
}

export type LiquidationData = {
  id: string
  user: string
  generationDate: string
  liquidationDate: string
  client: Client | null
  posEntries: POS[]
  totalBilling: number
  totalRental: number
  totalCommission: number
  transferCost: number
  otherCost: OtherCost | null
  subtotal: number
  iva: number
  totalCost: number
  liquidationAmount: number
}

// Equipos POS con su ubicación
export type POSEquipment = {
  id: string
  location: "client" | "available" | "unavailable" | "archived"
  clientId?: string
  clientName?: string
}

type ClientContextType = {
  clients: Client[]
  selectedClient: Client | null
  liquidationDate: string
  posEntries: POS[]
  otherCost: OtherCost | null
  liquidationData: LiquidationData | null
  liquidationHistory: LiquidationData[]
  posEquipment: POSEquipment[]
  selectClient: (client: Client) => void
  setLiquidationDate: (date: string) => void
  addPOS: (pos: POS) => void
  updatePOS: (id: string, billing: number) => void
  removePOS: (id: string) => void
  setOtherCost: (description: string, amount: number) => void
  clearOtherCost: () => void
  calculateLiquidation: () => void
  resetLiquidation: () => void
  addClient: (
    id: string,
    name: string,
    rentalFee: number,
    commissionRate: number,
    phone?: string,
    email?: string,
    address?: string,
  ) => void
  updateClient: (
    oldId: string,
    newId: string,
    name: string,
    rentalFee: number,
    commissionRate: number,
    phone?: string,
    email?: string,
    address?: string,
  ) => void
  removeClient: (id: string) => void
  changePOSStatus: (
    posId: string,
    newStatus: "client" | "available" | "unavailable" | "archived",
    clientId?: string,
  ) => void
}

const defaultClients: Client[] = [
  {
    id: "1",
    name: "Cliente A",
    rentalFee: 100,
    commissionRate: 2.5,
    phone: "099123456",
    email: "clienteA@example.com",
    address: "Av. Principal 123",
  },
  {
    id: "2",
    name: "Cliente B",
    rentalFee: 120,
    commissionRate: 3.0,
    phone: "099789012",
    email: "clienteB@example.com",
  },
  {
    id: "3",
    name: "Cliente C",
    rentalFee: 90,
    commissionRate: 2.0,
    email: "clienteC@example.com",
    address: "Calle Secundaria 456",
  },
]

const defaultPOS: Record<string, string[]> = {
  "1": ["POS001", "POS002", "POS003"],
  "2": ["POS004", "POS005"],
  "3": ["POS006", "POS007", "POS008", "POS009"],
}

const defaultPOSEquipment: POSEquipment[] = [
  { id: "POS001", location: "client", clientId: "1", clientName: "Cliente A" },
  { id: "POS002", location: "client", clientId: "1", clientName: "Cliente A" },
  { id: "POS003", location: "client", clientId: "1", clientName: "Cliente A" },
  { id: "POS004", location: "client", clientId: "2", clientName: "Cliente B" },
  { id: "POS005", location: "client", clientId: "2", clientName: "Cliente B" },
  { id: "POS006", location: "client", clientId: "3", clientName: "Cliente C" },
  { id: "POS007", location: "client", clientId: "3", clientName: "Cliente C" },
  { id: "POS008", location: "client", clientId: "3", clientName: "Cliente C" },
  { id: "POS009", location: "client", clientId: "3", clientName: "Cliente C" },
  { id: "POS010", location: "available" },
  { id: "POS011", location: "available" },
  { id: "POS012", location: "unavailable" },
  { id: "POS013", location: "archived" },
]

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(defaultClients)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [liquidationDate, setLiquidationDate] = useState<string>("")
  const [posEntries, setPosEntries] = useState<POS[]>([])
  const [otherCost, setOtherCostState] = useState<OtherCost | null>(null)
  const [liquidationData, setLiquidationData] = useState<LiquidationData | null>(null)
  const [liquidationHistory, setLiquidationHistory] = useState<LiquidationData[]>([])
  const [posEquipment, setPosEquipment] = useState<POSEquipment[]>(defaultPOSEquipment)

  const selectClient = (client: Client) => {
    setSelectedClient(client)
    // Pre-load POS for this client
    const clientPOS = defaultPOS[client.id] || []
    setPosEntries(clientPOS.map((id) => ({ id, billing: 0 })))
  }

  const addPOS = (pos: POS) => {
    setPosEntries((prev) => [...prev, pos])
  }

  const updatePOS = (id: string, billing: number) => {
    setPosEntries((prev) => prev.map((pos) => (pos.id === id ? { ...pos, billing } : pos)))
  }

  const removePOS = (id: string) => {
    setPosEntries((prev) => prev.filter((pos) => pos.id !== id))
  }

  const setOtherCost = (description: string, amount: number) => {
    if (description.trim() && amount > 0) {
      setOtherCostState({ description, amount })
    } else {
      setOtherCostState(null)
    }
  }

  const clearOtherCost = () => {
    setOtherCostState(null)
  }

  const calculateLiquidation = () => {
    if (!selectedClient) return

    const totalBilling = posEntries.reduce((sum, pos) => sum + pos.billing, 0)
    const totalRental = selectedClient.rentalFee * posEntries.length
    const totalCommission = (selectedClient.commissionRate / 100) * totalBilling
    const transferCost = 70

    // Include other cost if it exists
    const otherCostAmount = otherCost ? otherCost.amount : 0

    const subtotal = totalRental + totalCommission + transferCost + otherCostAmount
    const iva = 0.22 * subtotal
    const totalCost = subtotal + iva
    const liquidationAmount = totalBilling - totalCost

    const newLiquidation = {
      id: uuidv4().substring(0, 8),
      user: "current_user",
      generationDate: new Date().toISOString(),
      liquidationDate,
      client: selectedClient,
      posEntries,
      totalBilling,
      totalRental,
      totalCommission,
      transferCost,
      otherCost,
      subtotal,
      iva,
      totalCost,
      liquidationAmount,
    }

    setLiquidationData(newLiquidation)
    setLiquidationHistory((prev) => [...prev, newLiquidation])
  }

  const resetLiquidation = () => {
    setSelectedClient(null)
    setLiquidationDate("")
    setPosEntries([])
    setOtherCostState(null)
    setLiquidationData(null)
  }

  const addClient = (
    id: string,
    name: string,
    rentalFee: number,
    commissionRate: number,
    phone?: string,
    email?: string,
    address?: string,
  ) => {
    const newClient = {
      id: id || uuidv4().substring(0, 8),
      name,
      rentalFee,
      commissionRate,
      phone,
      email,
      address,
    }
    setClients((prev) => [...prev, newClient])
  }

  const updateClient = (
    oldId: string,
    newId: string,
    name: string,
    rentalFee: number,
    commissionRate: number,
    phone?: string,
    email?: string,
    address?: string,
  ) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === oldId ? { ...client, id: newId, name, rentalFee, commissionRate, phone, email, address } : client,
      ),
    )

    // Update POS equipment references if client ID changed
    if (oldId !== newId) {
      setPosEquipment((prev) =>
        prev.map((pos) => (pos.clientId === oldId ? { ...pos, clientId: newId, clientName: name } : pos)),
      )
    }
  }

  const removeClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id))
  }

  const changePOSStatus = (
    posId: string,
    newStatus: "client" | "available" | "unavailable" | "archived",
    clientId?: string,
  ) => {
    setPosEquipment((prev) => {
      return prev.map((pos) => {
        if (pos.id === posId) {
          if (newStatus === "client" && clientId) {
            const client = clients.find((c) => c.id === clientId)
            return {
              ...pos,
              location: newStatus,
              clientId,
              clientName: client?.name || "Cliente desconocido",
            }
          } else {
            // Remove client info if status is not "client"
            const { clientId, clientName, ...rest } = pos
            return {
              ...rest,
              location: newStatus,
            }
          }
        }
        return pos
      })
    })
  }

  return (
    <ClientContext.Provider
      value={{
        clients,
        selectedClient,
        liquidationDate,
        posEntries,
        otherCost,
        liquidationData,
        liquidationHistory,
        posEquipment,
        selectClient,
        setLiquidationDate,
        addPOS,
        updatePOS,
        removePOS,
        setOtherCost,
        clearOtherCost,
        calculateLiquidation,
        resetLiquidation,
        addClient,
        updateClient,
        removeClient,
        changePOSStatus,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export function useClientContext() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error("useClientContext must be used within a ClientProvider")
  }
  return context
}

export function usePOSEquipment() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error("useClientContext must be used within a ClientProvider")
  }
  return context.posEquipment
}

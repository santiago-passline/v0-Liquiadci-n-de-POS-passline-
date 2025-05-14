"use client"

import { useState } from "react"
import { useClientContext } from "@/context/client-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ClientSelection from "@/components/client-selection"
import POSManagement from "@/components/pos-management"
import Calculations from "@/components/calculations"
import LiquidationReport from "@/components/liquidation-report"
import StepIndicator from "@/components/step-indicator"
import { useToast } from "@/hooks/use-toast"

const steps = [
  { id: "client", title: "Selección de Cliente" },
  { id: "pos", title: "Gestión de POS" },
  { id: "calculations", title: "Cálculos" },
  { id: "report", title: "Reporte de Liquidación" },
]

export default function StepperLayout() {
  const [currentStep, setCurrentStep] = useState(0)
  const { selectedClient, posEntries, liquidationData } = useClientContext()
  const { toast } = useToast()

  const handleNext = () => {
    // Validation before proceeding to next step
    if (currentStep === 0 && !selectedClient) {
      toast({
        title: "Error",
        description: "Por favor seleccione un cliente y fecha de liquidación",
        variant: "destructive",
      })
      return
    }

    if (currentStep === 1 && posEntries.length === 0) {
      toast({
        title: "Error",
        description: "Por favor agregue al menos un POS",
        variant: "destructive",
      })
      return
    }

    if (currentStep === 2 && !liquidationData) {
      toast({
        title: "Error",
        description: "Por favor calcule la liquidación primero",
        variant: "destructive",
      })
      return
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ClientSelection />
      case 1:
        return <POSManagement />
      case 2:
        return <Calculations />
      case 3:
        return <LiquidationReport />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-md shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Sistema de Liquidación POS</h1>

        <StepIndicator steps={steps} currentStep={currentStep} />

        <Card className="p-6 border-0 shadow-sm mt-6">{renderStepContent()}</Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} className="flex items-center gap-1 bg-[#F7B928] hover:bg-[#e5aa25] text-black">
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

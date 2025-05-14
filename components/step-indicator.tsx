"use client"

import { cn } from "@/lib/utils"

type Step = {
  id: string
  title: string
}

type StepIndicatorProps = {
  steps: Step[]
  currentStep: number
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                index <= currentStep ? "bg-[#F7B928] text-black" : "bg-gray-200 text-gray-500",
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "text-xs mt-2 text-center",
                index <= currentStep ? "text-[#F7B928] font-medium" : "text-gray-500",
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="relative mt-4">
        <div className="absolute top-0 h-1 bg-gray-200 w-full rounded-full"></div>
        <div
          className="absolute top-0 h-1 bg-[#F7B928] rounded-full transition-all"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

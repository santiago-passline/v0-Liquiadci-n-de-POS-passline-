import StepperLayout from "@/components/stepper-layout"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-6 px-4 flex-1">
        <StepperLayout />
      </main>
    </div>
  )
}

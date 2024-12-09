"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { ExperimentsTable } from "@/components/experiments-table"
import { CreateExperimentModal } from "@/components/create-experiment-modal"
import { FilterButton } from "@/components/filter-button"
import { FilterValues } from "@/components/filter-dialog"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"home" | "experiments" | "reports">("home")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    key: "",
    name: "",
    createdBy: "",
    status: []
  })

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + (value.length > 0 ? 1 : 0)
      }
      return count + (value ? 1 : 0)
    }, 0)
  }

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters)
  }

  const handleResetFilters = () => {
    setActiveFilters({
      key: "",
      name: "",
      createdBy: "",
      status: []
    })
  }

  return (
    <AppLayout onNavigate={setCurrentPage} currentPage={currentPage}>
      {currentPage === "home" && (
        <>
          <h1 className="mb-6 text-[32px] font-medium text-[#1B1B1B]">
            Welcome to A/B Testing Platform
          </h1>
          <div className="space-y-4 text-[15px] leading-relaxed text-[#1B1B1B]">
            <p>
              This internal application helps teams at American Express manage and analyze A/B tests
              across various digital products. Use the navigation menu to access experiments or view
              reports.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </>
      )}
      {currentPage === "experiments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <FilterButton
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                activeFilters={getActiveFilterCount()}
                initialValues={activeFilters}
              />
            </div>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-[#006FCF] text-white hover:bg-[#005FB3]"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experiment
            </Button>
          </div>
          <ExperimentsTable filters={activeFilters} />
        </div>
      )}
      {currentPage === "reports" && (
        <h1 className="text-[32px] font-medium text-[#1B1B1B]">Reports</h1>
      )}
      
      <CreateExperimentModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </AppLayout>
  )
}


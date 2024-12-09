"use client"

import { SlidersHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { FilterDialog, FilterValues } from "./filter-dialog"
import { useState } from "react"

interface FilterButtonProps {
  onApplyFilters: (filters: FilterValues) => void
  onResetFilters: () => void
  activeFilters: number
  initialValues: FilterValues
}

export function FilterButton({ onApplyFilters, onResetFilters, activeFilters, initialValues }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-white text-[#006FCF] border-[#006FCF] hover:bg-[#E6F2FF]"
      >
        <SlidersHorizontal className="h-4 w-4" />
        {activeFilters > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#006FCF] text-white text-xs flex items-center justify-center">
            {activeFilters}
          </span>
        )}
      </Button>
      <FilterDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApply={onApplyFilters}
        onReset={onResetFilters}
        initialValues={initialValues}
      />
    </div>
  )
}


"use client"

import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import * as React from "react"

interface FilterDialogProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterValues) => void
  onReset: () => void
  initialValues?: FilterValues
}

export interface FilterValues {
  key: string
  name: string
  createdBy: string
  status: string[]
}

const STATUS_OPTIONS = ["Draft", "Running", "Paused", "Marked for Deletion"]

export function FilterDialog({ isOpen, onClose, onApply, onReset, initialValues }: FilterDialogProps) {
  const [filters, setFilters] = React.useState<FilterValues>(initialValues || {
    key: "",
    name: "",
    createdBy: "",
    status: []
  })

  const handleStatusChange = (value: string) => {
    setFilters(current => ({
      ...current,
      status: current.status.includes(value)
        ? current.status.filter(s => s !== value)
        : [...current.status, value]
    }))
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({
      key: "",
      name: "",
      createdBy: "",
      status: []
    })
    onReset()
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 mt-2 w-[400px] bg-white shadow-lg rounded-lg border border-gray-200 z-50">
      <div className="bg-[#006FCF] p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-normal text-white">Filter</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-white/80"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Filter by name"
              value={filters.name}
              onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Key</Label>
            <Input
              placeholder="Filter by key"
              value={filters.key}
              onChange={(e) => setFilters(prev => ({ ...prev, key: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Created By</Label>
            <Input
              placeholder="Filter by creator"
              value={filters.createdBy}
              onChange={(e) => setFilters(prev => ({ ...prev, createdBy: e.target.value }))}
            />
          </div>
          <div className="space-y-3">
            <Label>Status</Label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={status}
                    checked={filters.status.includes(status)}
                    onCheckedChange={() => handleStatusChange(status)}
                  />
                  <label
                    htmlFor={status}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-[100px]"
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          className="w-[100px] bg-[#006FCF] hover:bg-[#005FB3]"
        >
          Apply
        </Button>
      </div>
    </div>
  )
}


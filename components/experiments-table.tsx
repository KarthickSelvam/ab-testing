"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Trash2, Play, Square, RotateCcw } from 'lucide-react'
import { useExperiments, Experiment } from "@/utils/experimentData"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ViewExperimentModal } from "./view-experiment-modal"
import { SortAscIcon, SortDescIcon, SortIcon } from "./icons"
import type { FilterValues } from "./filter-dialog"
import { useState } from 'react';
import { EditExperimentModal } from "./edit-experiment-modal"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type SortConfig = {
  key: keyof Experiment;
  direction: 'asc' | 'desc';
} | null;

interface ExperimentsTableProps {
  filters: FilterValues
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export function ExperimentsTable({ filters }: ExperimentsTableProps) {
  const { experiments, updateExperiments } = useExperiments();
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(5)
  const [selectedExperiment, setSelectedExperiment] = React.useState<Experiment | null>(null)
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({ key: 'createdDate', direction: 'desc' });
  const [editingExperiment, setEditingExperiment] = useState<Experiment | null>(null)

  const openViewModal = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
  };

  const closeViewModal = () => {
    setSelectedExperiment(null);
  };

  const handleSort = (key: keyof Experiment) => {
    setSortConfig(current => {
      if (current?.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' };
        }
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: keyof Experiment) => {
    if (sortConfig?.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? (
      <SortAscIcon className="ml-2 h-4 w-4 text-[#3B82F6]" />
    ) : (
      <SortDescIcon className="ml-2 h-4 w-4 text-[#3B82F6]" />
    );
  };

  const sortedExperiments = React.useMemo(() => {
    if (!sortConfig) return experiments;

    return [...experiments].sort((a, b) => {
      if (sortConfig.key === 'createdDate') {
        const dateA = new Date(a[sortConfig.key]).getTime();
        const dateB = new Date(b[sortConfig.key]).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [experiments, sortConfig]);

  const filteredExperiments = React.useMemo(() => {
    return sortedExperiments.filter(experiment => {
      if (filters.name && !experiment.title.toLowerCase().includes(filters.name.toLowerCase())) {
        return false
      }
      if (filters.key && !experiment.key.toLowerCase().includes(filters.key.toLowerCase())) {
        return false
      }
      if (filters.status.length > 0 && !filters.status.includes(experiment.status)) {
        return false
      }
      return true
    })
  }, [sortedExperiments, filters])

  const totalPages = Math.ceil(filteredExperiments.length / pageSize)

  const handleEditClick = (experiment: Experiment, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingExperiment(experiment)
  }

  const handleSaveEdit = (updatedExperiment: Experiment) => {
    const updatedExperiments = experiments.map(exp => 
      exp.id === updatedExperiment.id ? updatedExperiment : exp
    );
    updateExperiments(updatedExperiments);
    setEditingExperiment(null)
  }

  const handleStatusChange = (experiment: Experiment) => {
    let newStatus;
    switch (experiment.status) {
      case 'Draft':
      case 'Stopped':
        newStatus = 'Running';
        break;
      case 'Running':
        newStatus = 'Stopped';
        break;
      case 'Marked for Deletion':
        newStatus = experiment.statusHistory[experiment.statusHistory.length - 2]?.status || 'Draft';
        break;
    }
    const updatedExperiment = {
      ...experiment,
      status: newStatus,
      statusHistory: [
        ...experiment.statusHistory,
        { status: newStatus, changedBy: 'Current User', changedAt: new Date().toISOString() }
      ]
    };
    const updatedExperiments = experiments.map(exp => 
      exp.id === updatedExperiment.id ? updatedExperiment : exp
    );
    updateExperiments(updatedExperiments);
  }

  const getStatusActionButton = (experiment: Experiment) => {
    switch (experiment.status) {
      case 'Draft':
      case 'Stopped':
        return (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-50"
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(experiment);
            }}
          >
            <Play className="h-4 w-4" />
            <span className="sr-only">Start</span>
          </Button>
        );
      case 'Running':
        return (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(experiment);
            }}
          >
            <Square className="h-4 w-4" />
            <span className="sr-only">Stop</span>
          </Button>
        );
      case 'Marked for Deletion':
        return (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(experiment);
            }}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Restore</span>
          </Button>
        );
      default:
        return null;
    }
  };

  const getStatusActionTooltip = (experiment: Experiment) => {
    switch (experiment.status) {
      case 'Draft':
      case 'Stopped':
        return 'Start experiment';
      case 'Running':
        return 'Stop experiment';
      case 'Marked for Deletion':
        return 'Restore experiment';
      default:
        return 'Change experiment status';
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="border bg-gray-50">
              <th 
                className={`px-6 py-3 text-left text-sm font-medium text-gray-900 border cursor-pointer hover:bg-gray-100 ${
                  sortConfig?.key === 'title' ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Experiment Name
                  {getSortIcon('title')}
                </div>
              </th>
              <th 
                className={`px-6 py-3 text-left text-sm font-medium text-gray-900 border cursor-pointer hover:bg-gray-100 ${
                  sortConfig?.key === 'key' ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSort('key')}
              >
                <div className="flex items-center">
                  Experiment Key
                  {getSortIcon('key')}
                </div>
              </th>
              <th 
                className={`px-6 py-3 text-left text-sm font-medium text-gray-900 border cursor-pointer hover:bg-gray-100 ${
                  sortConfig?.key === 'createdBy' ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSort('createdBy')}
              >
                <div className="flex items-center">
                  Created By
                  {getSortIcon('createdBy')}
                </div>
              </th>
              <th 
                className={`px-6 py-3 text-left text-sm font-medium text-gray-900 border cursor-pointer hover:bg-gray-100 ${
                  sortConfig?.key === 'status' ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className={`px-6 py-3 text-left text-sm font-medium text-gray-900 border cursor-pointer hover:bg-gray-100 ${
                  sortConfig?.key === 'createdDate' ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSort('createdDate')}
              >
                <div className="flex items-center">
                  Created Date
                  {getSortIcon('createdDate')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExperiments.slice((page - 1) * pageSize, page * pageSize).map((experiment, idx) => (
              <tr 
                key={experiment.id}
                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} divide-y divide-gray-200 cursor-pointer hover:bg-gray-100`}
                onClick={() => openViewModal(experiment)}
              >
                <td className="px-6 py-4 text-sm text-gray-900 border">{experiment.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono border">{experiment.key}</td>
                <td className="px-6 py-4 text-sm text-gray-900 border">{experiment.createdBy}</td>
                <td className="px-6 py-4 text-sm text-gray-900 border">{experiment.status}</td>
                <td className="px-6 py-4 text-sm text-gray-900 border">
                  {formatDate(experiment.createdDate)}
                </td>
                <td className="px-6 py-4 border">
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {getStatusActionButton(experiment)}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getStatusActionTooltip(experiment)}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => handleEditClick(experiment, e)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit experiment</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            disabled={experiment.status === 'Marked for Deletion'}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete experiment</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue>{pageSize}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700">Results per page</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
          </div>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      </div>

      {selectedExperiment && (
        <ViewExperimentModal
          experiment={selectedExperiment}
          onClose={closeViewModal}
        />
      )}

      {editingExperiment && (
        <EditExperimentModal
          experiment={editingExperiment}
          isOpen={true}
          onClose={() => setEditingExperiment(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}


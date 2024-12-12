"use client"

import { X, Save, Plus, ChevronLeft } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Stepper } from "./stepper"
import { MultiValueInput } from "./multi-value-input"
import { RulesStep } from "./rules-step"
import { useState, useEffect } from 'react'
import { Experiment } from "@/utils/experimentData"

interface CreateExperimentModalProps {
  isOpen: boolean
  onClose: () => void
  experiment?: Experiment
}

export function CreateExperimentModal({ isOpen, onClose, experiment }: CreateExperimentModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = ['Overview', 'Rules', 'Targeting']

  const [title, setTitle] = useState('')
  const [key, setKey] = useState('')
  const [objective, setObjective] = useState('')
  const [status, setStatus] = useState('draft')
  const [variations, setVariations] = useState<string[]>([])

  const [isNextEnabled, setIsNextEnabled] = useState(false)

  useEffect(() => {
    if (experiment) {
      setTitle(experiment.title)
      setKey(experiment.key)
      setObjective(experiment.objective)
      setStatus(experiment.status)
      setVariations(experiment.variations)
    }
  }, [experiment])

  useEffect(() => {
    if (currentStep === 0) {
      setIsNextEnabled(
        title.trim() !== '' &&
        key.trim() !== '' &&
        variations.length > 0
      )
    } else {
      setIsNextEnabled(true) // For other steps, enable Next button by default
    }
  }, [currentStep, title, key, variations])

  const handleSave = () => {
    const newExperiment = {
      id: crypto.randomUUID(), // Generate a unique ID
      title,
      key,
      createdBy: 'currentUser', // Replace with the actual user
      objective,
      status: 'Draft',
      variations,
      rules: [], // Initialize with an empty array or appropriate default value
      createdDate: new Date().toISOString(),
      statusHistory: [{ status: 'Draft', date: new Date().toISOString() }] // Initialize with the current status
    };
  
    // Retrieve existing experiments from localStorage
    const existingExperiments = JSON.parse(localStorage.getItem('experiments') || '[]');
  
    // Add the new experiment to the list
    const updatedExperiments = [...existingExperiments, newExperiment];
  
    // Save the updated list back to localStorage
    localStorage.setItem('experiments', JSON.stringify(updatedExperiments));
  
    console.log('Saving experiment:', newExperiment);
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[20px] font-normal text-[#1B1B1B] block">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter experiment title"
                  className="w-full h-[52px] px-4 rounded-lg border border-gray-300 text-[16px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[20px] font-normal text-[#1B1B1B] block">
                Key
                </label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="experiment_key"
                  className="w-full h-[52px] px-4 rounded-lg border border-gray-300 text-[16px] font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  disabled={!!experiment}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[20px] font-normal text-[#1B1B1B] block">
                Objective
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Describe the hypothesis of this experiment"
                className="w-full h-[120px] px-4 py-3 rounded-lg border border-gray-300 text-[16px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none"
              ></textarea>
            </div>
            <div className="space-y-1">
              <label className="text-[20px] font-normal text-[#1B1B1B] block">
                Variations
              </label>
              <div className="text-[15px] text-gray-500 mb-2">Add variations for your experiment (press Enter to add)</div>
              <MultiValueInput
                values={variations}
                onChange={setVariations}
                placeholder="Enter a variation"
                disabled={!!experiment}
              />
            </div>
          </div>
        )
      case 1:
        return <RulesStep variations={variations} initialRules={experiment?.rules} />
      case 2:
        return <div>Targeting Content</div>
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0 gap-0 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-[#F8F9FA] p-8 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[32px] font-normal text-[#1B1B1B]">
              {experiment ? 'Edit Experiment' : 'Create New Experiment'}
            </DialogTitle>
            <button
              onClick={onClose}
              className="relative p-2 rounded-lg group hover:bg-[#E6F2FF] transition-colors"
            >
              <div className="absolute inset-0 rounded-lg border-2 border-[#3B82F6]" />
              <X className="h-5 w-5 text-[#3B82F6]" />
            </button>
          </div>
        </DialogHeader>
        {/* Content */}
        <div className="p-8">
          <Stepper steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="px-8 py-6 flex justify-end gap-3">
            {currentStep === 0 ? (
              <>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 h-11 rounded-lg border border-[#3B82F6] text-[#3B82F6] text-[15px] font-medium hover:bg-[#EBF2FF] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Rules
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isNextEnabled}
                  className={`flex-1 h-11 rounded-lg text-white text-[15px] font-medium transition-colors flex items-center justify-center gap-2 ${
                    isNextEnabled
                      ? 'bg-[#3B82F6] hover:bg-[#2563EB]'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </button>
              </>
            ) : currentStep === 1 ? (
              <>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 h-11 rounded-lg border border-[#3B82F6] text-[#3B82F6] text-[15px] font-medium hover:bg-[#EBF2FF] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Targets
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 h-11 rounded-lg bg-[#3B82F6] text-white text-[15px] font-medium hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1 h-11 rounded-lg border border-[#3B82F6] text-[#3B82F6] text-[15px] font-medium hover:bg-[#EBF2FF] transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 h-11 rounded-lg bg-[#3B82F6] text-white text-[15px] font-medium hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


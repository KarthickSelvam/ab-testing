"use client"

import { X, Save, Plus, Play, Square } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MultiValueInput } from "./multi-value-input"
import { RulesStep } from "./rules-step"
import { useState, useEffect } from 'react'
import { Experiment } from "@/utils/experimentData"

interface EditExperimentModalProps {
  experiment: Experiment
  isOpen: boolean
  onClose: () => void
  onSave: (updatedExperiment: Experiment) => void
}

export function EditExperimentModal({ experiment, isOpen, onClose, onSave }: EditExperimentModalProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [editedExperiment, setEditedExperiment] = useState<Experiment>(experiment)
  const [fieldDisabled, setFieldDisabled] = useState({
    title: false,
    objective: false,
    variations: experiment.status !== 'Draft',
    rules: false,
  });

  useEffect(() => {
    setEditedExperiment(experiment)
  }, [experiment])

  useEffect(() => {
    if (experiment.status === 'Draft') {
      setFieldDisabled({
        title: false,
        objective: false,
        variations: false,
        rules: false,
      });
    } else if (experiment.status === 'Running') {
      setFieldDisabled({
        title: false,
        objective: false,
        variations: true,
        rules: true,
      });
    } else {
      setFieldDisabled({
        title: true,
        objective: true,
        variations: true,
        rules: true,
      });
    }
  }, [experiment.status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedExperiment(prev => ({ ...prev, [name]: value }))
  }

  const handleVariationsChange = (variations: string[]) => {
    setEditedExperiment(prev => ({ ...prev, variations }))
  }

  const handleSave = (newStatus: string) => {
    const updatedExperiment = {
      ...editedExperiment,
      status: newStatus,
      statusHistory: [
        ...editedExperiment.statusHistory,
        { status: newStatus, changedBy: 'Current User', changedAt: new Date().toISOString() }
      ]
    };
    onSave(updatedExperiment)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[20px] font-normal text-[#1B1B1B] block">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editedExperiment.title}
                  onChange={handleInputChange}
                  disabled={fieldDisabled.title}
                  placeholder="Enter experiment title"
                  className={`w-full h-[52px] px-4 rounded-lg border border-gray-300 text-[16px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${
                    fieldDisabled.title ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[20px] font-normal text-[#1B1B1B] block">
                  Key
                </label>
                <input
                  type="text"
                  name="key"
                  value={editedExperiment.key}
                  className="w-full h-[52px] px-4 rounded-lg border border-gray-300 text-[16px] font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  disabled
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[20px] font-normal text-[#1B1B1B] block">
                Objective
              </label>
              <textarea
                name="objective"
                value={editedExperiment.objective}
                onChange={handleInputChange}
                disabled={fieldDisabled.objective}
                placeholder="Describe the hypothesis of this experiment"
                className={`w-full h-[120px] px-4 py-3 rounded-lg border border-gray-300 text-[16px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none ${
                  fieldDisabled.objective ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[20px] font-normal text-[#1B1B1B] block">
                Variations
              </label>
              <div className="text-[15px] text-gray-500 mb-2">Add variations for your experiment (press Enter to add)</div>
              <MultiValueInput
                values={editedExperiment.variations}
                onChange={handleVariationsChange}
                placeholder="Enter a variation"
                disabled={fieldDisabled.variations}
                disableRemove={fieldDisabled.variations}
              />
            </div>
          </div>
        );
      case 'rules':
        return (
          <RulesStep 
            variations={editedExperiment.variations} 
            initialRules={editedExperiment.rules}
            onChange={(newRules) => setEditedExperiment(prev => ({ ...prev, rules: newRules }))}
            disabled={fieldDisabled.rules}
          />
        );
      case 'targeting':
        return (
          <div className="py-8 text-center text-gray-500">
            Targeting configuration coming soon
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] p-0 gap-0 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-[#F8F9FA] p-8 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[32px] font-normal text-[#1B1B1B]">
              Edit Experiment
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
        <div className="p-8">
          <div className="mb-8">
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
              {['overview', 'rules', 'targeting'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  disabled={experiment.status !== 'Draft' && tab !== 'overview'}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-[#006FCF] text-white'
                      : experiment.status !== 'Draft' && tab !== 'overview'
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-[#006FCF] hover:bg-[#E6F2FF]'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {renderTabContent()}
        </div>
        <div className="border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="px-8 py-6 flex justify-end gap-3">
            {editedExperiment.status === 'Draft' || editedExperiment.status === 'Stopped' ? (
              <>
                <button
                  onClick={() => handleSave(editedExperiment.status)}
                  className="flex-1 h-11 rounded-lg border border-[#3B82F6] text-[#3B82F6] text-[15px] font-medium hover:bg-[#EBF2FF] transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save {editedExperiment.status === 'Draft' ? 'Draft' : 'Stopped'}
                </button>
                <button
                  onClick={() => handleSave('Running')}
                  className="flex-1 h-11 rounded-lg bg-[#3B82F6] text-white text-[15px] font-medium hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {editedExperiment.status === 'Draft' ? 'Run Experiment' : 'Start Experiment'}
                </button>
              </>
            ) : editedExperiment.status === 'Running' ? (
              <>
                <button
                  onClick={() => handleSave('Stopped')}
                  className="flex-1 h-11 rounded-lg bg-red-500 text-white text-[15px] font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Stop Experiment
                </button>
                <button
                  onClick={() => handleSave(editedExperiment.status)}
                  className="flex-1 h-11 rounded-lg bg-[#3B82F6] text-white text-[15px] font-medium hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => handleSave(editedExperiment.status)}
                className="flex-1 h-11 rounded-lg bg-[#3B82F6] text-white text-[15px] font-medium hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


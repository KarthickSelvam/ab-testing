import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Experiment } from "@/utils/experimentData"
import { StatusTimeline } from "./status-timeline"
import { X, Edit, Trash2, PlayCircle, RotateCcw, Square, ChevronDown } from 'lucide-react'
import { useState } from 'react';
import { EditExperimentModal } from "./edit-experiment-modal"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ViewExperimentModalProps {
  experiment: Experiment
  onClose: () => void
}

export function ViewExperimentModal({ experiment, onClose }: ViewExperimentModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const isMarkedForDeletion = experiment.status === 'Marked for Deletion';
  const isDraftOrStopped = experiment.status === 'Draft' || experiment.status === 'Stopped';

  const handleEditClick = () => {
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (updatedExperiment: Experiment) => {
    // Implement the logic to update the experiment in your data store
    console.log('Saving updated experiment:', updatedExperiment)
    setIsEditModalOpen(false)
  }

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-[800px] p-0 gap-0 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="bg-[#F8F9FA] p-8 rounded-t-2xl sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-[32px] font-normal text-[#1B1B1B]">
                  {experiment.title}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">{experiment.key}</p>
              </div>
              <button
                onClick={onClose}
                className="relative p-2 rounded-lg group hover:bg-[#E6F2FF] transition-colors"
              >
                <div className="absolute inset-0 rounded-lg border-2 border-[#3B82F6]" />
                <X className="h-5 w-5 text-[#3B82F6]" />
              </button>
            </div>
          </DialogHeader>
          <div className="p-8 flex flex-col">
            <div className="flex">
              <div className="flex-1 space-y-6 pr-8">
                <div>
                  <h3 className="text-[20px] font-normal text-[#1B1B1B]">Objective</h3>
                  <p className="text-[16px] text-gray-700">{experiment.objective}</p>
                </div>
                <div>
                  <h3 className="text-[20px] font-normal text-[#1B1B1B]">Variations</h3>
                  <ul className="list-disc pl-5 text-[16px] text-gray-700">
                    {experiment.variations.map((variation, index) => (
                      <li key={index}>{variation}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[20px] font-normal text-[#1B1B1B]">Rules</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {experiment.variations.map((variation, index) => {
                      const rule = experiment.rules.find(r => r.variation === variation) || { action: 'allow', percentage: 100 };
                      return (
                        <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg overflow-hidden mb-2">
                          <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-gray-50">
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium text-[15px]">{variation}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">{rule.action} ({rule.percentage}%)</span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-2 bg-gray-50">
                            <div className="space-y-2">
                              <p><strong>Action:</strong> {rule.action}</p>
                              <p><strong>Percentage:</strong> {rule.percentage}%</p>
                              {rule.rankingType && <p><strong>Ranking Type:</strong> {rule.rankingType}</p>}
                              {rule.nextBestVariations && (
                                <div>
                                  <strong>Next Best Variations:</strong>
                                  <ul className="list-disc pl-5">
                                    {rule.nextBestVariations.map((variation, idx) => (
                                      <li key={idx}>{variation}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {rule.valueFormat && <p><strong>Value Format:</strong> {rule.valueFormat}</p>}
                              {rule.checkValueItems && (
                                <div>
                                  <strong>Check Value Items:</strong>
                                  <ul className="list-disc pl-5">
                                    {rule.checkValueItems.map((item, idx) => (
                                      <li key={idx}>Weight: {item.weight}, Value: {item.value}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              </div>
              <div className="w-64 border-l pl-8">
                <h3 className="text-[20px] font-normal text-[#1B1B1B] mb-4">Status History</h3>
                <StatusTimeline statusHistory={experiment.statusHistory} />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 sticky bottom-0 bg-white">
            <div className="px-8 py-6 flex justify-end gap-3">
              {isDraftOrStopped && (
                <Button
                  className="flex-1 h-11 px-6 rounded-lg bg-green-500 text-white text-[15px] font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <PlayCircle className="h-4 w-4" />
                  {experiment.status === 'Draft' ? 'Publish' : 'Start'}
                </Button>
              )}
              {experiment.status === 'Running' && (
                <Button
                  className="flex-1 h-11 px-6 rounded-lg bg-red-500 text-white text-[15px] font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              )}
              <Button
                disabled={isMarkedForDeletion}
                onClick={handleEditClick}
                className={`flex-1 h-11 px-6 rounded-lg text-white text-[15px] font-medium transition-colors flex items-center justify-center gap-2 ${
                  isMarkedForDeletion ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3B82F6] hover:bg-[#2563EB]'
                }`}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                className="flex-1 h-11 px-6 rounded-lg bg-red-500 text-white text-[15px] font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EditExperimentModal
        experiment={experiment}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </>
  )
}


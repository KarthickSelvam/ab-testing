"use client"

import { useState } from "react"
import { BeakerIcon, ChevronDownIcon, PlusIcon, SearchIcon, PencilIcon, PauseIcon, PlayIcon, LogOutIcon, BarChartIcon, HelpCircleIcon, XIcon, TrashIcon, EyeIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type ActionType = 'allow' | 'suppress' | 'nextBestVariation' | 'checkValue'
type ExperimentStatus = 'running' | 'paused' | 'draft' | 'marked for deletion'

interface CheckValueItem {
  weightage: string
  value: string
  format: 'number' | 'string'
}

interface Treatment {
  id: number
  name: string
  traffic: number
  action: ActionType
  nextBestVariations?: string[]
  checkValue?: CheckValueItem[]
  rankingType?: 'dynamic' | 'static';
}

interface Experiment {
  id: number
  name: string
  key: string
  status: ExperimentStatus
  isPaused: boolean
  variations: string[]
}

interface VariationInputProps {
  variations: string[]
  setVariations: React.Dispatch<React.SetStateAction<string[]>>
}

const VariationInput: React.FC<VariationInputProps> = ({ variations, setVariations }) => {
  const addVariation = () => {
    setVariations([...variations, ''])
  }

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index))
  }

  const updateVariation = (index: number, value: string) => {
    const newVariations = [...variations]
    newVariations[index] = value
    setVariations(newVariations)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="variations" className="text-sm font-medium">Variations</Label>
      {variations.map((variation, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={variation}
            onChange={(e) => updateVariation(index, e.target.value)}
            placeholder={`Variation ${index + 1}`}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeVariation(index)}
            disabled={variations.length <= 2}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addVariation} className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Variation
      </Button>
    </div>
  )
}

export function AbTestingPortal() {
  const [step, setStep] = useState("overview")
  const [treatments, setTreatments] = useState<Treatment[]>([
    { id: 0, name: "Control", traffic: 50, action: 'allow' },
    { id: 1, name: "Treatment 1", traffic: 50, action: 'allow' },
  ])
  const [experiments, setExperiments] = useState<Experiment[]>([
    { id: 1, name: "Test Experiment 1", key: "test_exp_1", status: "running", isPaused: false, variations: ["Control", "Variation A"] },
    { id: 2, name: "Test Experiment 2", key: "test_exp_2", status: "paused", isPaused: true, variations: ["Control", "Variation B"] },
    { id: 3, name: "Test Experiment 3", key: "test_exp_3", status: "draft", isPaused: false, variations: ["Control", "Variation C"] },
    { id: 4, name: "Test Experiment 4", key: "test_exp_4", status: "marked for deletion", isPaused: false, variations: ["Control", "Variation D"] },
    { id: 5, name: "Test Experiment 5", key: "test_exp_5", status: "running", isPaused: false, variations: ["Control", "Variation E"] },
  ])
  const [filter, setFilter] = useState("all")
  const [variations, setVariations] = useState<string[]>(["Control", "Variation A"])
  const [valueFormat, setValueFormat] = useState<'number' | 'string'>('number');
  const [rankingType, setRankingType] = useState<'dynamic' | 'static'>('static');

  const togglePause = (id: number) => {
    setExperiments(experiments.map(exp => 
      exp.id === id ? { ...exp, isPaused: !exp.isPaused } : exp
    ))
  }

  const filteredExperiments = experiments.filter(exp => {
    if (filter === "running") return exp.status === "running" && !exp.isPaused
    if (filter === "paused") return exp.status === "paused" || exp.isPaused
    if (filter === "drafts") return exp.status === "draft"
    if (filter === "marked for deletion") return exp.status === "marked for deletion"
    return true
  })

  const addTreatment = () => {
    setTreatments([...treatments, { 
      id: treatments.length, 
      name: `Treatment ${treatments.length}`, 
      traffic: 50,
      action: 'allow'
    }])
  }

  const removeTreatment = (id: number) => {
    setTreatments(treatments.filter(v => v.id !== id))
  }

  const updateTreatment = (id: number, field: string, value: any) => {
    setTreatments(treatments.map(v => 
      v.id === id ? { 
        ...v, 
        [field]: value,
        ...(field === 'action' && value === 'nextBestVariation' ? { rankingType: 'static' } : {})
      } : v
    ))
  }

  const addCheckValueItem = (treatmentId: number) => {
    setTreatments(treatments.map(v => 
      v.id === treatmentId ? {
        ...v,
        checkValue: [...(v.checkValue || []), { weightage: "", value: "", format: valueFormat }]
      } : v
    ))
  }

  const removeCheckValueItem = (treatmentId: number, index: number) => {
    setTreatments(treatments.map(v => 
      v.id === treatmentId ? {
        ...v,
        checkValue: v.checkValue?.filter((_, i) => i !== index)
      } : v
    ))
  }

  const updateCheckValueItem = (treatmentId: number, index: number, field: 'weightage' | 'value', value: string) => {
    setTreatments(treatments.map(v => 
      v.id === treatmentId ? {
        ...v,
        checkValue: v.checkValue?.map((item, i) => 
          i === index ? { 
            ...item, 
            [field]: field === 'value' && item.format === 'number' ? (isNaN(parseFloat(value)) ? item.value : value) : value 
          } : item
        )
      } : v
    ))
  }

  const isValidVariationName = (name: string) => {
    return /^[a-zA-Z0-9\s_\-@]+$/.test(name)
  }

  const addNextBestVariation = (treatmentId: number, variationName: string) => {
    setTreatments(treatments.map(treatment => {
      if (treatment.id === treatmentId) {
        const currentNextBest = treatment.nextBestVariations || []
        if (!currentNextBest.includes(variationName)) {
          return { ...treatment, nextBestVariations: [...currentNextBest, variationName] }
        }
      }
      return treatment
    }))
  }

  const removeNextBestVariation = (treatmentId: number, variationName: string) => {
    setTreatments(treatments.map(treatment => {
      if (treatment.id === treatmentId && treatment.nextBestVariations) {
        return {
          ...treatment,
          nextBestVariations: treatment.nextBestVariations.filter(v => v !== variationName)
        }
      }
      return treatment
    }))
  }

  const moveVariationOrder = (treatmentId: number, index: number, direction: 'up' | 'down') => {
    setTreatments(treatments.map(treatment => {
      if (treatment.id === treatmentId && treatment.nextBestVariations) {
        const newNextBest = [...treatment.nextBestVariations]
        const swapIndex = direction === 'up' ? index - 1 : index + 1

        if (swapIndex >= 0 && swapIndex < newNextBest.length) {
          [newNextBest[index], newNextBest[swapIndex]] = [newNextBest[swapIndex], newNextBest[index]]
          return { ...treatment, nextBestVariations: newNextBest }
        }
      }
      return treatment
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-14 items-center gap-4 px-4 md:px-6">
          <Link className="flex items-center gap-2 font-semibold" href="#">
            <BeakerIcon className="h-6 w-6" />
            <span>Chennai Express</span>
          </Link>
          <div className="flex-1" />
          <Button variant="ghost" size="icon">
            <HelpCircleIcon className="h-5 w-5" />
            <span className="sr-only">FAQ</span>
          </Button>
        </div>
      </header>
      <div className="flex">
        <aside className="flex w-64 flex-col justify-between border-r bg-muted/40">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className="space-y-1">
                <Button className="w-full justify-start" variant="ghost">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
                <Button className="w-full justify-start" variant="secondary">
                  <BeakerIcon className="mr-2 h-4 w-4" />
                  Experiments
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <BarChartIcon className="mr-2 h-4 w-4" />
                  Reports
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <Button variant="ghost" className="w-full justify-start">
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">User Name</p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Experiments</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Experiment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Add new Experiment</DialogTitle>
                </DialogHeader>
                <Card>
                  <Tabs className="p-6" defaultValue="overview" value={step} onValueChange={setStep}>
                    <TabsList className="mb-4 grid w-full grid-cols-3">
                      <TabsTrigger value="overview">
                        <span className="mr-2 inline-block rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          1
                        </span>
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="rules">
                        <span className="mr-2 inline-block rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          2
                        </span>
                        Rules
                      </TabsTrigger>
                      <TabsTrigger value="targeting">
                        <span className="mr-2 inline-block rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          3
                        </span>
                        Targeting
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Experiment Name</Label>
                        <Input id="name" placeholder="Enter experiment name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="key">Experiment Key</Label>
                        <Input 
                          id="key" 
                          placeholder="Enter tracking key" 
                          onChange={(e) => e.target.value = e.target.value.toLowerCase()}
                        />
                        <p className="text-sm text-muted-foreground">
                          Unique identifier for this Experiment (lowercase only)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="objective">Objective</Label>
                        <Textarea
                          id="objective"
                          placeholder="e.g. Increase signup button clicks to improve revenue"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between font-normal">
                              Select Status
                              <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem>Draft</DropdownMenuItem>
                            <DropdownMenuItem>Running</DropdownMenuItem>
                            <DropdownMenuItem>Paused</DropdownMenuItem>
                            <DropdownMenuItem>Marked for Deletion</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <VariationInput variations={variations} setVariations={setVariations} />
                    </TabsContent>
                    <TabsContent value="rules" className="space-y-6">
                      <div>
                        <Label>Variations</Label>
                        <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto pr-4">
                          {treatments.map((treatment) => (
                            <div key={treatment.id} className="space-y-4 border-b pb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-10 flex items-center justify-center bg-muted rounded-md font-medium">
                                  {treatment.id + 1}
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                      {treatment.name || "Select Variation"}
                                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-full">
                                    {variations.map((variation) => (
                                      <DropdownMenuItem key={variation} onSelect={() => updateTreatment(treatment.id, 'name', variation)}>
                                        {variation}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <div className="flex items-center w-24">
                                  <Input 
                                    className="w-16 text-right pr-1" 
                                    type="number"
                                    value={treatment.traffic}
                                    onChange={(e) => updateTreatment(treatment.id, 'traffic', parseInt(e.target.value))}
                                  />
                                  <span className="ml-1">%</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeTreatment(treatment.id)}
                                  disabled={treatments.length <= 2}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-4">
                                <Label className="w-24">Action:</Label>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-40">
                                      {treatment.action}
                                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onSelect={() => updateTreatment(treatment.id, 'action', 'allow')}>
                                      allow
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => updateTreatment(treatment.id, 'action', 'suppress')}>
                                      suppress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => updateTreatment(treatment.id, 'action', 'nextBestVariation')}>
                                      nextBestVariation
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => updateTreatment(treatment.id, 'action', 'checkValue')}>
                                      checkValue
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              {treatment.action === 'nextBestVariation' && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-4 mb-2">
                                    <Label className="w-24">Ranking Type:</Label>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-40">
                                          {rankingType}
                                          <ChevronDownIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem onSelect={() => setRankingType('static')}>static</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setRankingType('dynamic')}>dynamic</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                  {rankingType === 'static' && (
                                    <>
                                      <Label className="text-sm font-medium">Next Best Variations:</Label>
                                      <div className="flex flex-col gap-2">
                                        <div className="flex justify-start">
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button variant="outline" className="w-[200px]">
                                                Select Variation
                                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                              {variations.filter(v => v !== treatment.name && !treatment.nextBestVariations?.includes(v)).map(v => (
                                                <DropdownMenuItem key={v} onSelect={() => addNextBestVariation(treatment.id, v)}>
                                                  {v}
                                                </DropdownMenuItem>
                                              ))}
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                        <div className="space-y-2">
                                          {treatment.nextBestVariations?.map((variation, index) => (
                                            <div key={index} className="flex items-center">
                                              <span className="flex-1 truncate">{variation}</span>
                                              <div className="flex items-center gap-1 ml-2">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => moveVariationOrder(treatment.id, index, 'up')}
                                                  disabled={index === 0}
                                                >
                                                  <ArrowUpIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => moveVariationOrder(treatment.id, index, 'down')}
                                                  disabled={index === treatment.nextBestVariations.length - 1}
                                                >
                                                  <ArrowDownIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => removeNextBestVariation(treatment.id, variation)}
                                                >
                                                  <XIcon className="h-4 w-4" />
                                                  <span className="sr-only">Remove {variation}</span>
                                                </Button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                              {treatment.action === 'checkValue' && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-4 mb-2">
                                    <Label className="w-24">Value Format:</Label>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-40" disabled={treatment.checkValue && treatment.checkValue.length > 0}>
                                          {valueFormat}
                                          <ChevronDownIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem onSelect={() => setValueFormat('number')}>number</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setValueFormat('string')}>string</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                  <Label>Check Value Items:</Label>
                                  {treatment.checkValue?.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                      <Input
                                        className="w-24"
                                        type="number"
                                        placeholder="Weightage"
                                        value={item.weightage}
                                        onChange={(e) => updateCheckValueItem(treatment.id, index, 'weightage', e.target.value)}
                                      />
                                      <Input
                                        className="flex-1"
                                        type={item.format === 'number' ? 'number' : 'text'}
                                        placeholder="Value"
                                        value={item.value}
                                        onChange={(e) => updateCheckValueItem(treatment.id, index, 'value', e.target.value)}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeCheckValueItem(treatment.id, index)}
                                      >
                                        <XIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    variant="outline"
                                    onClick={() => addCheckValueItem(treatment.id)}
                                  >
                                    Add Check Value Item
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                          <Button variant="outline" className="w-full" onClick={addTreatment}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Variation
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="targeting" className="space-y-6">
                      <div>
                        <h3 className="mb-4 text-lg font-medium">Target by Attributes</h3>
                        <div className="flex items-center gap-4">
                          <div className="w-20">IF</div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-40">
                                id
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>userId</DropdownMenuItem>
                              <DropdownMenuItem>email</DropdownMenuItem>
                              <DropdownMenuItem>company</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-40">
                                is equal to
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>contains</DropdownMenuItem>
                              <DropdownMenuItem>starts with</DropdownMenuItem>
                              <DropdownMenuItem>ends with</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Input className="flex-1" placeholder="Enter value" />
                          <Button variant="ghost" size="icon">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="start-time">Start Time</Label>
                            <Input id="start-time" type="datetime-local" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="end-time">End Time</Label>
                            <Input id="end-time" type="datetime-local" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="start-immediately">Start Experiment Immediately</Label>
                          <p className="text-sm text-muted-foreground">
                            If On, the Experiment will start serving traffic as soon as the feature is published
                          </p>
                        </div>
                        <Switch id="start-immediately" />
                      </div>
                      <div className="flex justify-start">
                        <Button variant="outline" onClick={() => setStep("rules")}>
                          Back
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="flex justify-end gap-4 mt-6 pb-4 px-6">
                    <Button variant="outline" className="min-w-[100px]">Cancel</Button>
                    <Button className="min-w-[200px]">Save Experiment</Button>
                  </div>
                </Card>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <div className="space-x-2">
              <Button
                variant={filter === "running" ? "secondary" : "ghost"}
                onClick={() => setFilter("running")}
              >
                Running {experiments.filter(e => e.status === "running" && !e.isPaused).length}
              </Button>
              <Button
                variant={filter === "paused" ? "secondary" : "ghost"}
                onClick={() => setFilter("paused")}
              >
                Paused {experiments.filter(e => e.status === "paused" || e.isPaused).length}
              </Button>
              <Button
                variant={filter === "drafts" ? "secondary" : "ghost"}
                onClick={() => setFilter("drafts")}
              >
                Drafts {experiments.filter(e => e.status === "draft").length}
              </Button>
              <Button
                variant={filter === "marked for deletion" ? "secondary" : "ghost"}
                onClick={() => setFilter("marked for deletion")}
              >
                Marked for Deletion {experiments.filter(e => e.status === "marked for deletion").length}
              </Button>
              <Button
                variant={filter === "all" ? "secondary" : "ghost"}
                onClick={() => setFilter("all")}
              >
                Clear
              </Button>
            </div>
            <Input className="w-64" placeholder="Search experiments..." />
          </div>
          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left w-1/2">Experiment</th>
                  <th className="px-4 py-2 text-center w-1/4">Status</th>
                  <th className="px-4 py-2 text-center w-1/4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExperiments.map((experiment) => (
                  <tr key={experiment.id} className="border-b">
                    <td className="px-4 py-2">
                      <div>{experiment.name}</div>
                      <div className="text-sm text-muted-foreground">{experiment.key}</div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center">
                        <Badge>{experiment.status}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePause(experiment.id)}
                        >
                          {experiment.isPaused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <EyeIcon className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>View Experiment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold">Name</h3>
                                <p>{experiment.name}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold">Key</h3>
                                <p>{experiment.key}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold">Status</h3>
                                <p>{experiment.status}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold">Variations</h3>
                                <ul className="list-disc pl-5">
                                  {experiment.variations.map((variation, index) => (
                                    <li key={index}>{variation}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <PencilIcon className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}

<style jsx>{`
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }
  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`}</style>
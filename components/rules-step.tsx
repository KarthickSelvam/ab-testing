"use client"

import { Plus, Trash2, ChevronUp, ChevronDown, X, ExpandIcon as ExpandMore } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface CheckValueItem {
  weight: number
  value: string
}

interface Rule {
  variation: string
  action: string
  percentage: number
  rankingType?: 'static' | 'dynamic'
  nextBestVariations?: string[]
  valueFormat?: 'string' | 'number'
  checkValueItems?: CheckValueItem[]
}

interface RulesStepProps {
  variations: string[]
  initialRules?: Rule[]
  onChange?: (rules: Rule[]) => void
  disabled?: boolean
}

export function RulesStep({ variations, initialRules = [], onChange, disabled = false }: RulesStepProps) {
  const [rules, setRules] = useState<Rule[]>(initialRules)

  const actions = ["allow", "suppress", "nextBestVariation", "checkValue"]
  const valueFormats = ["string", "number"]

  const getUnusedVariations = () => variations.filter(v => !rules.some(r => r.variation === v))

  const getAvailableNextBestVariations = (currentRule: Rule) => {
    return variations.filter(v => 
      v !== currentRule.variation && 
      !currentRule.nextBestVariations?.includes(v)
    )
  }

  const addRule = () => {
    const unusedVariations = getUnusedVariations()
    if (unusedVariations.length > 0) {
      const newRule: Rule = {
        variation: unusedVariations[0],
        action: 'allow',
        percentage: 0,
        rankingType: 'static',
        nextBestVariations: [],
        valueFormat: 'string',
        checkValueItems: []
      }
      const newRules = [...rules, newRule]
      setRules(newRules)
      onChange?.(newRules)
    }
  }

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index)
    setRules(newRules)
    onChange?.(newRules)
  }

  const updateRule = (index: number, field: keyof Rule, value: any) => {
    const newRules = [...rules]
    if (field === 'action') {
      if (value === 'nextBestVariation') {
        newRules[index] = {
          ...newRules[index],
          [field]: value,
          rankingType: 'static',
          nextBestVariations: []
        }
      } else if (value === 'checkValue') {
        newRules[index] = {
          ...newRules[index],
          [field]: value,
          valueFormat: 'string',
          checkValueItems: []
        }
      } else {
        newRules[index] = { ...newRules[index], [field]: value }
      }
    } else {
      newRules[index] = { ...newRules[index], [field]: value }
    }
    setRules(newRules)
    onChange?.(newRules)
  }

  const addCheckValueItem = (ruleIndex: number) => {
    const newRules = [...rules]
    const checkValueItems = [...(newRules[ruleIndex].checkValueItems || []), { weight: 50, value: '' }]
    newRules[ruleIndex] = { ...newRules[ruleIndex], checkValueItems }
    setRules(newRules)
    onChange?.(newRules)
  }

  const updateCheckValueItem = (ruleIndex: number, itemIndex: number, field: keyof CheckValueItem, value: string | number) => {
    const newRules = [...rules]
    const checkValueItems = [...(newRules[ruleIndex].checkValueItems || [])]
    checkValueItems[itemIndex] = { 
      ...checkValueItems[itemIndex], 
      [field]: field === 'weight' ? Number(value) : value 
    }
    newRules[ruleIndex] = { ...newRules[ruleIndex], checkValueItems }
    setRules(newRules)
    onChange?.(newRules)
  }

  const removeCheckValueItem = (ruleIndex: number, itemIndex: number) => {
    const newRules = [...rules]
    const checkValueItems = newRules[ruleIndex].checkValueItems?.filter((_, i) => i !== itemIndex)
    newRules[ruleIndex] = { ...newRules[ruleIndex], checkValueItems }
    setRules(newRules)
    onChange?.(newRules)
  }

  const addNextBestVariation = (ruleIndex: number, variation: string) => {
    const newRules = [...rules]
    const nextBestVariations = [...(newRules[ruleIndex].nextBestVariations || []), variation]
    newRules[ruleIndex] = { ...newRules[ruleIndex], nextBestVariations }
    setRules(newRules)
    onChange?.(newRules)
  }

  const removeNextBestVariation = (ruleIndex: number, variationIndex: number) => {
    const newRules = [...rules]
    const nextBestVariations = newRules[ruleIndex].nextBestVariations?.filter((_, i) => i !== variationIndex)
    newRules[ruleIndex] = { ...newRules[ruleIndex], nextBestVariations }
    setRules(newRules)
    onChange?.(newRules)
  }

  const moveNextBestVariation = (ruleIndex: number, variationIndex: number, direction: 'up' | 'down') => {
    const newRules = [...rules]
    const nextBestVariations = [...(newRules[ruleIndex].nextBestVariations || [])]
    const newIndex = direction === 'up' ? variationIndex - 1 : variationIndex + 1

    if (newIndex >= 0 && newIndex < nextBestVariations.length) {
      [nextBestVariations[variationIndex], nextBestVariations[newIndex]] = 
      [nextBestVariations[newIndex], nextBestVariations[variationIndex]]
      
      newRules[ruleIndex] = { ...newRules[ruleIndex], nextBestVariations }
      setRules(newRules)
      onChange?.(newRules)
    }
  }

  return (
    <div className="space-y-6">
      {rules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-[15px] text-gray-500 mb-4">No rules configured yet</p>
          <button
            onClick={addRule}
            disabled={disabled}
            className={`h-11 px-6 rounded-lg bg-[#3B82F6] text-white text-[15px] font-medium hover:bg-[#2563EB] transition-colors flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Plus className="h-4 w-4" />
            Add Rule
          </button>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {rules.map((rule, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-[15px]">{rule.variation}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{rule.action}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-4 space-y-1">
                    <label className="text-[15px] font-normal text-[#1B1B1B] block">
                      Variation
                    </label>
                    <Select
                      value={rule.variation}
                      onValueChange={(value) => updateRule(index, 'variation', value)}
                      disabled={disabled}
                    >
                      <SelectTrigger className="h-[52px]">
                        <SelectValue placeholder="Select variation" />
                      </SelectTrigger>
                      <SelectContent>
                        {getUnusedVariations().concat(rule.variation).map((variation) => (
                          <SelectItem key={variation} value={variation}>
                            {variation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4 space-y-1">
                    <label className="text-[15px] font-normal text-[#1B1B1B] block">
                      Action
                    </label>
                    <Select
                      value={rule.action}
                      onValueChange={(value) => updateRule(index, 'action', value)}
                      disabled={disabled}
                    >
                      <SelectTrigger className="h-[52px]">
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        {actions.map((action) => (
                          <SelectItem key={action} value={action}>
                            {action}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[15px] font-normal text-[#1B1B1B] block">
                      %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={rule.percentage}
                      onChange={(e) => updateRule(index, 'percentage', parseInt(e.target.value) || 0)}
                      className="w-full h-[52px] px-2 rounded-lg border border-gray-300 text-[16px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      disabled={disabled}
                    />
                  </div>
                  <button
                    onClick={() => removeRule(index)}
                    disabled={disabled}
                    className={`col-span-1 space-y-1 h-[52px] w-[52px] flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:text-[#EF4444] hover:border-[#EF4444] transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {rule.action === 'nextBestVariation' && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-1">
                      <label className="text-[15px] font-normal text-[#1B1B1B] block">
                        Ranking Type
                      </label>
                      <Select
                        value={rule.rankingType}
                        onValueChange={(value) => updateRule(index, 'rankingType', value)}
                        disabled={disabled}
                      >
                        <SelectTrigger className="h-[52px]">
                          <SelectValue placeholder="Select ranking type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="static">Static</SelectItem>
                          <SelectItem value="dynamic">Dynamic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {rule.rankingType === 'static' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[15px] font-normal text-[#1B1B1B] block">
                            Next Best Variations
                          </label>
                          <Select
                            value=""
                            onValueChange={(value) => addNextBestVariation(index, value)}
                            disabled={disabled}
                          >
                            <SelectTrigger className="h-[52px]">
                              <SelectValue placeholder="Select variation" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableNextBestVariations(rule).map((variation) => (
                                <SelectItem key={variation} value={variation}>
                                  {variation}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {rule.nextBestVariations && rule.nextBestVariations.length > 0 && (
                          <div className="space-y-2">
                            {rule.nextBestVariations.map((variation, variationIndex) => (
                              <div
                                key={variationIndex}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <span className="text-[15px] text-gray-700">{variation}</span>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => moveNextBestVariation(index, variationIndex, 'up')}
                                    disabled={disabled || variationIndex === 0}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => moveNextBestVariation(index, variationIndex, 'down')}
                                    disabled={disabled || variationIndex === rule.nextBestVariations.length - 1}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => removeNextBestVariation(index, variationIndex)}
                                    disabled={disabled}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {rule.action === 'checkValue' && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-1">
                      <label className="text-[15px] font-normal text-[#1B1B1B] block">
                        Value Format
                      </label>
                      <Select
                        value={rule.valueFormat}
                        onValueChange={(value) => updateRule(index, 'valueFormat', value)}
                        disabled={disabled}
                      >
                        <SelectTrigger className="h-[52px]">
                          <SelectValue placeholder="Select value format" />
                        </SelectTrigger>
                        <SelectContent>
                          {valueFormats.map((format) => (
                            <SelectItem key={format} value={format}>
                              {format}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[15px] font-normal text-[#1B1B1B] block">
                        Check Value Items
                      </label>
                      <div className="space-y-3">
                        {rule.checkValueItems?.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3">
                            <div className="w-24">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.weight}
                                onChange={(e) => updateCheckValueItem(index, itemIndex, 'weight', e.target.value)}
                                className="w-full h-[52px] px-3 rounded-lg border border-gray-300 text-[16px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                disabled={disabled}
                              />
                            </div>
                            <div className="flex-1">
                              <input
                                type={rule.valueFormat === 'number' ? 'number' : 'text'}
                                value={item.value}
                                onChange={(e) => updateCheckValueItem(index, itemIndex, 'value', e.target.value)}
                                placeholder="Value"
                                className="w-full h-[52px] px-3 rounded-lg border border-gray-300 text-[16px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                disabled={disabled}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-[52px] w-[52px] p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => removeCheckValueItem(index, itemIndex)}
                              disabled={disabled}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => addCheckValueItem(index)}
                          disabled={disabled}
                        >
                          Add Check Value Item
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {getUnusedVariations().length > 0 && (
        <button
          onClick={addRule}
          disabled={disabled}
          className={`h-11 px-6 rounded-lg border border-[#3B82F6] text-[#3B82F6] text-[15px] font-medium transition-colors flex items-center gap-2 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#EBF2FF]'
          }`}
        >
          <Plus className="h-4 w-4" />
          Add Another Rule
        </button>
      )}
    </div>
  )
}


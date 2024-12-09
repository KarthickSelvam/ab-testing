import React, { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface MultiValueInputProps {
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export function MultiValueInput({ values, onChange, placeholder }: MultiValueInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      onChange([...values, inputValue.trim()])
      setInputValue('')
    }
  }

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3 mb-3">
        {values.map((value, index) => (
          <span key={index} className="bg-white text-[#3B82F6] px-4 py-2 rounded-full border border-[#E6F2FF] flex items-center gap-2">
            {value}
            <button onClick={() => removeValue(index)} className="text-[#3B82F6] hover:text-[#2563EB]">
              <X className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`${values.length} variations added`}
        className="w-full h-[52px] px-4 rounded-lg border border-gray-300 text-[16px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
      />
    </div>
  )
}


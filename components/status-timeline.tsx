import { Clock, Edit, Play, Square, Trash2 } from 'lucide-react'
import { StatusTransition } from '@/utils/experimentData'

interface StatusTimelineProps {
  statusHistory: StatusTransition[]
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'draft':
      return Edit
    case 'running':
      return Play
    case 'paused':
      return Pause
    case 'marked for deletion':
      return Trash2
    case 'stopped':
      return Square
    default:
      return Clock
  }
}

const getStatusIconColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'running':
      return 'text-green-500'
    case 'paused':
      return 'text-amber-500'
    case 'marked for deletion':
      return 'text-red-500'
    case 'stopped':
      return 'text-red-500'
    default:
      return 'text-blue-500'
  }
}

export function StatusTimeline({ statusHistory }: StatusTimelineProps) {
  const reversedHistory = [...statusHistory].reverse()
  const currentStatus = reversedHistory[0]

  return (
    <div className="relative flex flex-col space-y-6 before:absolute before:inset-0 before:left-4 before:ml-0.5 before:h-full before:w-0.5 before:border-l-2 before:border-dashed before:border-gray-200">
      {reversedHistory.map((transition, index) => {
        const StatusIcon = getStatusIcon(transition.status)
        const isCurrent = index === 0

        return (
          <div key={index} className={`flex items-center space-x-4 ${isCurrent ? 'mb-6' : ''}`}>
            <div className={`z-10 flex items-center justify-center rounded-full bg-gray-100 ${
              isCurrent ? 'w-10 h-10' : 'w-8 h-8'
            }`}>
              <StatusIcon className={`${getStatusIconColor(transition.status)} ${isCurrent ? 'w-5 h-5' : 'w-4 w-4'}`} />
            </div>
            <div className="flex-1">
              <time className={`mb-1 font-normal leading-none text-gray-500 ${
                isCurrent ? 'text-base' : 'text-sm'
              }`}>
                {new Date(transition.changedAt).toLocaleString()}
              </time>
              <p className={`font-semibold text-gray-900 ${isCurrent ? 'text-lg' : 'text-base'}`}>
                {transition.status}
              </p>
              <p className={`mt-1 font-normal text-gray-600 ${isCurrent ? 'text-base' : 'text-sm'}`}>
                Changed by: {transition.changedBy}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}


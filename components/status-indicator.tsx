"use client"

import ProgressBar from "./progress-bar"

interface StatusIndicatorProps {
  isLoading: boolean
}

export default function StatusIndicator({ isLoading }: StatusIndicatorProps) {
  if (!isLoading) {
    return null
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div className="w-64">
        <ProgressBar totalTasks={1} completedTasks={0} isIndeterminate={true} />
      </div>
    </div>
  )
}

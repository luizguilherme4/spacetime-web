'use client'

import { Trash } from 'lucide-react'

interface Props {
  deleteMemory: (value: string) => void
  id: string
}

export function DeleteButton({ deleteMemory, id }: Props) {
  return (
    <button
      className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-100 hover:text-red-500"
      onClick={() => {
        deleteMemory(id)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }}
    >
      <Trash className="h-4 w-4" />
      Excluir
    </button>
  )
}

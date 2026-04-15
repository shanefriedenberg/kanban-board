import { useDroppable } from '@dnd-kit/core'
import type { ReactNode } from 'react'

type ColumnProps = {
    id: string
    title: string
    count: number
    children: ReactNode
}

function Column({id,title,count,children}: ColumnProps) {
    const {setNodeRef, isOver} = useDroppable({id})

    return (
        <div
            ref={setNodeRef}
            className={`
    bg-zinc-900 rounded-xl p-5 border transition-colors min-h-[300px]
    ${isOver ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-zinc-800'}
      `}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    {title}
                </h2>
                <span className="text-xs font-medium text-zinc-600 tabular-nums">
          {count}
        </span>
            </div>
            <div className="flex flex-col gap-2">
                {children}
            </div>
        </div>
    )

}

export default Column
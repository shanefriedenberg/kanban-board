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
        <div ref={setNodeRef} className={`bg-zinc-900 rounded-lg p-4 ${isOver ? 'ring-2 ring-blue-500' : ''}`}>
            <h2 className={'font-semibold mb-4 text-zinc-300'}>
                {title} ({count})
            </h2>
            <div className={"flex flex-col gap-2"}>
                {children}
            </div>
        </div>
    )

}

export default Column
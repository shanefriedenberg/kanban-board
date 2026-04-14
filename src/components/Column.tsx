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
        <div ref={setNodeRef} className={`bg-slate-800 rounded-lg p-4 ${isOver ? 'ring-2 ring-blue-500' : ''}`}>
            <h2 className={"bg-slate-800 rounded-lg p-4 ${isOver ? 'ring-2 ring-blue-500' : ''}"}>
                {title} ({count})
            </h2>
            <div className={"flex flex-col gap-2"}>
                {children}
            </div>
        </div>
    )

}

export default Column
import { useDraggable } from '@dnd-kit/core'

type TaskCardProps = {
    id: string
    title: string
    isNew?:boolean;
    dueDate?:string | null
}

function TaskCard({ id, title, isNew, dueDate }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
    const dueInfo = (() => {
        if (!dueDate) return null

        const due = new Date(dueDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        due.setHours(0, 0, 0, 0)

        const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return { label: 'Overdue', className: 'bg-red-500/15 text-red-400 border-red-500/30' }
        if (diffDays === 0) return { label: 'Today', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' }
        if (diffDays <= 3) return { label: `${diffDays}d`, className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' }
        return null
    })()

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
  group bg-zinc-800 rounded-lg p-4 border border-zinc-700/50
  text-sm text-zinc-100 font-medium leading-snug
  cursor-grab active:cursor-grabbing
  transition-[background-color,border-color] duration-150
  hover:border-zinc-600 hover:bg-zinc-800/80
  focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50
  ${isNew ? 'animate-fade-in-up' : ''}
  ${isDragging ? 'opacity-40 scale-105 shadow-2xl shadow-black/50 z-50 relative' : ''}
      `}
        >
            {title}
            {dueInfo && (
                <div className="mt-2">
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${dueInfo.className}`}>
      {dueInfo.label}
    </span>
                </div>
            )}
        </div>
    )
}

export default TaskCard
import { useDraggable } from '@dnd-kit/core'

type TaskCardProps = {
    id: string
    title: string
}

function TaskCard({ id, title }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })

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
  ${isDragging ? 'opacity-40 scale-105 shadow-2xl shadow-black/50 z-50 relative' : ''}
      `}
        >
            {title}
        </div>
    )
}

export default TaskCard
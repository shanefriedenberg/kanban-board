import { useDraggable } from '@dnd-kit/core'

type TaskCardProps = {
    id: string
    title: string
}

function TaskCard( {id,title} : TaskCardProps){
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({id})
    const style = transform
    ? {transform:`translate3d(${transform.x}px, ${transform.y}px, 0)`}
        : undefined

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-zinc-700 rounded-md p-3 text-sm cursor-grab ${isDragging ? 'opacity-50' : ''}`}
        >
            {title}
        </div>
    )
}

export default TaskCard
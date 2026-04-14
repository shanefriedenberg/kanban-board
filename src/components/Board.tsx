import {useEffect, useState} from 'react'
import {supabase} from '../lib/supabase'

type Task = {
    id: string;
    title: string;
    description: string | null;
    status: 'todo' | 'in_progress' | 'in_review' | 'done';
    priority: 'low' | 'medium' | 'high' | null;
    due_date: string;
    created_at: string;
    user_id: string;
}

type BoardProps = {
    userId: string;
}
const COLUMNS: { id: Task['status']; title: string }[] = [
    {id: 'todo', title: 'To Do'},
    {id: 'in_progress', title: 'In Progress'},
    {id: 'in_review', title: 'In Review'},
    {id: 'done', title: 'Done'}

]

function Board({userId: _userId}: BoardProps) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchTasks() {
            const {data, error} = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', {ascending: true})
            if (error) {
                setError(error.message)
                setLoading(false)
                return
            }
            setTasks(data as Task[]);
            setLoading(false);

        }

        fetchTasks()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-8">
                <p>Loading tasks...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-8">
                <p className="text-red-400">Error: {error}</p>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-8">My Board</h1>
            <div className="grid grid-cols-4 gap-4">
                {COLUMNS.map((column) => {
                    const columnTasks = tasks.filter((task) => task.status === column.id)
                    return (
                        <div key={column.id} className="bg-slate-800 rounded-lg p-4">
                            <h2 className="font-semibold mb-4 text-slate-300">
                                {column.title} ({columnTasks.length})
                            </h2>
                            <div className="flex flex-col gap-2">
                                {columnTasks.length === 0 ? (
                                    <p className="text-slate-500 text-sm">No tasks</p>
                                ) : (
                                    columnTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="bg-slate-700 rounded-md p-3 text-sm"
                                        >
                                            {task.title}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
    export default Board;
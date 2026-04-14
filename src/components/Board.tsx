import {useEffect, useState} from 'react'
import {supabase} from '../lib/supabase'
import { DndContext} from '@dnd-kit/core'
import type{DragEndEvent} from "@dnd-kit/core";
import Column from './Column'
import TaskCard from './TaskCard'

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
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState("")

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
    async function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event
        if (!over) return

        const taskId = active.id as string
        const newStatus = over.id as Task['status']

        const task = tasks.find((t) => t.id === taskId)
        if (!task || task.status === newStatus) return

        const previousTasks = tasks

        setTasks(
            tasks.map((t) =>
                t.id === taskId ? { ...t, status: newStatus } : t
            )
        )

        const {error} = await supabase
            .from('tasks')
            .update({status: newStatus})
            .eq('id', taskId)
        if (error) {
            setTasks(previousTasks)
            setError(error.message)
        }
    }
    async function handleCreateTask(){
            const title = newTaskTitle.trim()
            if(!title) return
            const {data, error} = await supabase
                .from('tasks')
                .insert({
                    title,
                    status:'todo',
                    user_id : _userId
                })
                .select()
                .single()
        if (error) {
            setError(error.message)
            setNewTaskTitle("")
            setLoading(false)
            return
        }
        setTasks([...tasks, data as Task]);
        setLoading(false);
        }






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
            <div className="mb-6">
                {!isFormOpen ? (
                    <button className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-md border border-slate-700" onClick={() => setIsFormOpen(true)}>
                        Add New Task
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e)=>
                            setNewTaskTitle(e.target.value)}
                            placeholder={"New Task..."}
                            autoFocus
                            className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-md border border-slate-700"
                        />
                        <button onClick={handleCreateTask} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">
                            Create
                        </button>
                        <button onClick={() => {
                            setIsFormOpen(false)
                            setNewTaskTitle("")
                        }} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md">
                            Cancel
                        </button>
                    </div>
                )}
            </div>
            <DndContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-4 gap-4">
                    {COLUMNS.map((column) => {
                        const columnTasks = tasks.filter((task) => task.status === column.id)
                        return (
                            <Column
                                key={column.id}
                                id={column.id}
                                title={column.title}
                                count={columnTasks.length}
                            >
                                {columnTasks.length === 0 ? (
                                    <p className="text-slate-500 text-sm">No tasks</p>
                                ) : (
                                    columnTasks.map((task) => (
                                        <TaskCard key={task.id} id={task.id} title={task.title} />
                                    ))
                                )}
                            </Column>
                        )
                    })}
                </div>
            </DndContext>
        </div>
        )

}
    export default Board;
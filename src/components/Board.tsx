import {useEffect, useState, useRef} from 'react'
import {supabase} from '../lib/supabase'
import { DndContext} from '@dnd-kit/core'
import type{DragEndEvent} from "@dnd-kit/core";
import Column from './Column'
import TaskCard from './TaskCard'
import SplitText from './SplitText'

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
const handleAnimationComplete = () => {
    console.log('All letters have animated!');
};

function Board({userId: _userId}: BoardProps) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const previousTaskIdsRef = useRef<Set<string>>(new Set())
    const [newTaskIds, setNewTaskIds] = useState<Set<string>>(new Set())
    const [newDueDate, setNewDueDate] = useState("")


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
    useEffect(() => {
        const seen = previousTaskIdsRef.current
        const fresh = new Set<string>()
        tasks.forEach((task) => {
            if (!seen.has(task.id)) {
                fresh.add(task.id)
            }
        })
        setNewTaskIds(fresh)
        previousTaskIdsRef.current = new Set(tasks.map((t) => t.id))
    }, [tasks])
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
                    user_id : _userId,
                    due_date :newDueDate || null
                })
                .select()
                .single()
        if (error) {
            setError(error.message)
            return
        }
        setTasks([...tasks, data as Task]);
        setNewTaskTitle("")
        setNewDueDate("")
        setIsFormOpen(false);
        }
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.status === 'done').length,
        overdue: tasks.filter((t) => {
            if (!t.due_date || t.status === 'done') return false
            const due = new Date(t.due_date)
            due.setHours(0, 0, 0, 0)
            return due.getTime() < today.getTime()
        }).length,
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
                <p className="text-zinc-500 text-sm">Loading tasks...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
                <p className="text-red-400 text-sm">Error: {error}</p>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-violet-500"></div>
                        <h1 className="font-display text-3xl text-zinc-100"><SplitText
                            text="Flow"
                            className="text-2xl font-semibold text-center"
                            delay={50}
                            duration={1.6}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="center"
                            onLetterAnimationComplete={handleAnimationComplete}


                        ></SplitText></h1>
                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1"><SplitText
                            text="Task Board"
                            className=""
                            delay={50}
                            duration={1.6}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="center"
                            onLetterAnimationComplete={handleAnimationComplete}


                        /></p>
                    </div>
                    <div className="text-xs text-white ">
                        <SplitText
                            key={`${stats.total}-${stats.completed}-${stats.overdue}`}
                            text={`${stats.total} Total  •  ${stats.completed} Done  •  ${stats.overdue} Overdue`}
                            className=""
                            delay={30}
                            duration={1.6}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 20 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="right"
                            onLetterAnimationComplete={handleAnimationComplete}
                        />

                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-8 py-8">

                <div className="mb-4">
                    {!isFormOpen ? (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                            + New task
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key == "Enter") handleCreateTask()
                                    if (e.key === 'Escape') {
                                        setIsFormOpen(false)
                                        setNewTaskTitle("")
                                        setNewDueDate("")
                                    }
                                }
                            }
                                placeholder="New task..."
                                autoFocus
                                className="flex-1 bg-zinc-900 text-zinc-100 placeholder-zinc-600 px-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-colors text-sm"
                            />
                            <input
                                type="date"
                                onChange={(e)=> setNewDueDate(e.target.value)}
                                className="bg-zinc-900 text-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-colors text-sm"
                                />
                            <button
                                onClick={handleCreateTask}
                                className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-violet-500/20 cursor-pointer"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => {
                                    setIsFormOpen(false)
                                    setNewTaskTitle("")
                                }}
                                className="bg-zinc-900/50 border border-transparent hover:bg-zinc-800 hover:border-zinc-800/50 text-white hover:text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <DndContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-4 gap-4 items-start">
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
                                        <div className="border border-dashed border-zinc-800 rounded-lg p-4 text-center">
                                            <p className="text-zinc-600 text-xs">No tasks</p>
                                        </div>
                                    ) : (
                                        columnTasks.map((task) => (
                                            <TaskCard key={task.id} id={task.id} title={task.title} isNew={newTaskIds.has(task.id)} dueDate={task.due_date}/>
                                        ))
                                    )}
                                </Column>
                            )
                        })}
                    </div>
                </DndContext>
            </main>
        </div>
    )


}
    export default Board;
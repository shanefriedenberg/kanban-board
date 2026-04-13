import { useEffect,useState } from 'react'
import { supabase } from "./lib/supabase"

function App(){
    const [userId, setUserId] = useState< string | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() =>{
        async function initAuth(){
            const { data: {session}} = await supabase.auth.getSession()

            if (session) {
                setUserId(session.user.id)
                setLoading(false)
                return
            }
            const { data , error } = await supabase.auth.signInAnonymously()
            if (error){
                console.error("anonymous sign-in failed", error)
                setLoading(false)
                return
            }
            setUserId(data.user?.id??null)
            setLoading(false)
        }
        initAuth()
    },[])
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
            <p>Loading...</p>
        </div>)
    }
    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Kanban incoming</h1>
                <p className="text-slate-400 text-sm">Signed in as: {userId}</p>
            </div>
        </div>
    )
}
export default App
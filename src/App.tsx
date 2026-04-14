import { useEffect,useState } from 'react'
import { supabase } from "./lib/supabase"
import Board from "./components/Board"

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
        <Board userId={userId!}/>
    )
}
export default App
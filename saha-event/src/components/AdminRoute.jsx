import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function AdminRoute({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setIsAdmin(data?.role === 'admin')
      } catch (err) {
        console.error('Error checking admin status:', err)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      checkAdmin()
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Vérification des droits...</div>
  }

  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

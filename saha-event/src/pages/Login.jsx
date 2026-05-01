import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animate-gradient" style={{
        background: 'linear-gradient(135deg, #1a0533, #6B21A8, #1a0533)',
        backgroundSize: '400% 400%'
      }}></div>

      {/* Floating decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent-pink rounded-full opacity-5 blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-20 w-80 h-80 bg-primary-mid rounded-full opacity-5 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

      {/* Form Card */}
      <div className="max-w-md w-full relative z-10">
        <div className="glass-card-lg p-10 shadow-2xl shadow-primary-mid/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold gradient-text">Saha✦Event</span>
            </Link>
            <p className="text-text-light/60 text-sm mt-2 italic">Prêt à organiser votre prochain grand moment ?</p>
          </div>

          <h2 className="text-3xl font-bold text-text-light mb-8 text-center">Connexion</h2>
          
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 p-4 text-red-300 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-light/80 mb-2">Email</label>
              <input
                type="email"
                required
                className="input-glass w-full"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-text-light/80">Mot de passe</label>
                <a href="#" className="text-xs text-accent hover:text-accent-pink transition">Oublié ?</a>
              </div>
              <input
                type="password"
                required
                className="input-glass w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-gradient w-full py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-8 text-center text-text-light/60 text-sm">
            Nouveau sur Saha-Event ?{' '}
            <Link to="/auth/register" className="text-accent font-bold hover:text-accent-pink transition">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Sign up user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      })

      if (signUpError) throw signUpError

      if (user) {
        // 2. Insert into profiles table
        const { error: profileError } = await supabase.from('profiles').insert({
          id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        })

        if (profileError) throw profileError
        
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 py-12 relative overflow-hidden">
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
            <p className="text-text-light/60 text-sm mt-2 italic">Rejoignez la communauté et créez des souvenirs.</p>
          </div>

          <h2 className="text-3xl font-bold text-text-light mb-8 text-center">Créer un compte</h2>
          
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 p-4 text-red-300 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-light/80 mb-2">Nom Complet</label>
              <input
                type="text"
                name="fullName"
                required
                className="input-glass w-full"
                placeholder="Ex: Amine Benali"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-light/80 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="input-glass w-full"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-light/80 mb-2">Téléphone</label>
              <input
                type="tel"
                name="phone"
                required
                className="input-glass w-full"
                placeholder="05XX XX XX XX"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-light/80 mb-2">Mot de passe</label>
              <input
                type="password"
                name="password"
                required
                minLength="6"
                className="input-glass w-full"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-gradient w-full py-3 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Création en cours...' : "S'inscrire"}
            </button>
          </form>

          <div className="mt-8 text-center text-text-light/60 text-sm">
            Déjà inscrit ?{' '}
            <Link to="/auth/login" className="text-accent font-bold hover:text-accent-pink transition">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

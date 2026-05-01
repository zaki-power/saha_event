import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-mid rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-accent-pink rounded-full blur-[100px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 lg:p-12 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center space-x-2 group mb-6">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary-mid to-accent-pink rounded-xl flex items-center justify-center shadow-lg shadow-primary-mid/20">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-accent transition-colors">
                Saha<span className="text-accent">✦</span>Event
              </span>
            </Link>
            <h2 className="text-3xl font-black text-white mb-2">Rejoignez-nous</h2>
            <p className="text-text-light/40 text-sm font-medium uppercase tracking-widest">Créez votre accès privilégié</p>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-500 font-bold text-xs">!</span>
                </div>
                <p className="text-red-400 text-xs font-bold leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-text-light/40 uppercase tracking-[0.2em] ml-1 group-focus-within:text-accent transition-colors">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light/30 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full input-glass pl-12 pr-6 py-3.5"
                  placeholder="Amine Benali"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-text-light/40 uppercase tracking-[0.2em] ml-1 group-focus-within:text-accent transition-colors">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light/30 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full input-glass pl-12 pr-6 py-3.5"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-text-light/40 uppercase tracking-[0.2em] ml-1 group-focus-within:text-accent transition-colors">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light/30 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full input-glass pl-12 pr-6 py-3.5"
                  placeholder="05XX XX XX XX"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-text-light/40 uppercase tracking-[0.2em] ml-1 group-focus-within:text-accent transition-colors">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light/30 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  required
                  minLength="6"
                  className="w-full input-glass pl-12 pr-6 py-3.5"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full bg-accent hover:bg-yellow-400 text-primary py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-accent/10 transition-all flex items-center justify-center gap-2 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <>
                  <span>S'inscrire</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-text-light/30 text-xs font-bold uppercase tracking-widest">
              Déjà inscrit ?{' '}
              <Link to="/auth/login" className="text-accent hover:text-white transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-6 text-text-light/20">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sécurisé par Supabase</span>
          </div>
          <div className="w-px h-4 bg-white/5"></div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Élite Expérience</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook as Facebook, 
  FaInstagram as Instagram, 
  FaTwitter as Twitter, 
  FaLinkedin as Linkedin 
} from 'react-icons/fa6';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight,
  Send,
  Sparkles
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
          
          {/* Brand & Description */}
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary-mid to-accent-pink rounded-xl flex items-center justify-center shadow-lg shadow-primary-mid/20">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-accent transition-colors">
                Saha<span className="text-accent">✦</span>Event
              </span>
            </Link>
            
            <p className="text-text-light/50 text-lg leading-relaxed max-w-md">
              La plateforme leader en Algérie pour la réservation d'espaces de réception. Nous connectons les palais les plus prestigieux avec vos moments les plus chers.
            </p>

            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-light/50 hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Exploration */}
            <div className="space-y-6">
              <h3 className="text-white font-black uppercase tracking-widest text-xs">Exploration</h3>
              <ul className="space-y-4">
                <li><Link to="/" className="text-text-light/40 hover:text-accent transition-colors text-sm font-bold uppercase tracking-wider">Accueil</Link></li>
                <li><Link to="/search" className="text-text-light/40 hover:text-accent transition-colors text-sm font-bold uppercase tracking-wider">Toutes les salles</Link></li>
                <li><Link to="/about" className="text-text-light/40 hover:text-accent transition-colors text-sm font-bold uppercase tracking-wider">À propos</Link></li>
                <li><Link to="/contact" className="text-text-light/40 hover:text-accent transition-colors text-sm font-bold uppercase tracking-wider">Contact</Link></li>
              </ul>
            </div>

            {/* Assistance */}
            <div className="space-y-6">
              <h3 className="text-white font-black uppercase tracking-widest text-xs">Assistance</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-light/40 hover:text-accent transition-colors text-sm font-bold uppercase tracking-wider">Aide & FAQ</a></li>
                <li><a href="#" className="text-text-light/40 hover:text-accent transition-colors text-sm font-bold uppercase tracking-wider">Conditions</a></li>
                <li><a href="#" className="text-text-light/40 hover:text-accent transition-colors text-sm font-bold uppercase tracking-wider">Confidentialité</a></li>
                <li><a href="#" className="text-text-light/40 hover:text-accent transition-colors text-sm font-bold uppercase tracking-wider">Sécurité</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h3 className="text-white font-black uppercase tracking-widest text-xs">Direct</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-accent" />
                  <span className="text-text-light/60 text-sm font-bold">+213 555 123 456</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-accent" />
                  <span className="text-text-light/60 text-sm font-bold">contact@saha.dz</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-accent mt-0.5" />
                  <span className="text-text-light/60 text-sm font-bold">Alger, Algérie</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 mb-20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-accent/10 group-hover:text-accent/20 transition-colors">
            <Sparkles size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-md text-center lg:text-left">
              <h4 className="text-3xl font-black text-white mb-2 tracking-tight">Restez à l'affût du luxe</h4>
              <p className="text-text-light/40 font-medium">Recevez en exclusivité les nouvelles ouvertures et offres saisonnières.</p>
            </div>
            
            <div className="flex w-full lg:w-auto gap-3">
              <div className="relative flex-1 lg:w-80 group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light/30 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-accent transition-all"
                />
              </div>
              <button className="bg-accent hover:bg-yellow-400 text-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-accent/20 flex items-center gap-2">
                <Send size={18} />
                <span className="hidden sm:inline">S'abonner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
          <p className="text-text-light/20 text-xs font-bold uppercase tracking-[0.2em]">
            &copy; {currentYear} Saha Event. Conçu avec excellence.
          </p>
          
          <div className="flex items-center gap-8">
            <a href="#" className="text-text-light/20 hover:text-accent transition-colors text-[10px] font-black uppercase tracking-widest">Sitemap</a>
            <a href="#" className="text-text-light/20 hover:text-accent transition-colors text-[10px] font-black uppercase tracking-widest">Partenaires</a>
            <a href="#" className="text-text-light/20 hover:text-accent transition-colors text-[10px] font-black uppercase tracking-widest">Juridique</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

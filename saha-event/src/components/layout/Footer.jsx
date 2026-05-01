import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapPin, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaArrowRight } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-white/10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold gradient-text">Saha✦Event</span>
            </Link>
            <p className="text-text-light/60 text-sm leading-relaxed mb-6">
              Trouvez la salle parfaite pour votre événement inoubliable. Réservez facilement et célébrez en confiance.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 glass-card flex items-center justify-center hover:bg-white/15 hover:border-accent/50 transition-all duration-300 transform hover:scale-110">
                <FaFacebook className="text-accent" size={18} />
              </a>
              <a href="#" className="w-10 h-10 glass-card flex items-center justify-center hover:bg-white/15 hover:border-accent/50 transition-all duration-300 transform hover:scale-110">
                <FaInstagram className="text-accent" size={18} />
              </a>
              <a href="#" className="w-10 h-10 glass-card flex items-center justify-center hover:bg-white/15 hover:border-accent/50 transition-all duration-300 transform hover:scale-110">
                <FaTwitter className="text-accent" size={18} />
              </a>
              <a href="#" className="w-10 h-10 glass-card flex items-center justify-center hover:bg-white/15 hover:border-accent/50 transition-all duration-300 transform hover:scale-110">
                <FaLinkedin className="text-accent" size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text-light font-bold text-lg mb-6">Accès Rapide</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-text-light/60 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-text-light/60 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  Rechercher une salle
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-light/60 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-light/60 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-text-light font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-text-light/60 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  Centre d&apos;aide
                </a>
              </li>
              <li>
                <a href="#" className="text-text-light/60 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  Conditions d&apos;utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-text-light/60 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-text-light/60 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-text-light font-bold text-lg mb-6">Nous Contacter</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                 <FaMapPin className="text-accent mr-3 mt-1 flex-shrink-0" size={16} />
                 <span className="text-text-light/60 text-sm">
                   Cité 1200 Logements<br />
                   Alger, Algérie
                 </span>
               </li>
              <li className="flex items-center">
                <FaPhone className="text-accent mr-3 flex-shrink-0" size={16} />
                <a href="tel:+213555123456" className="text-text-light/60 hover:text-accent transition-colors text-sm">
                  +213 (0) 555 12 34 56
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-accent mr-3 flex-shrink-0" size={16} />
                <a href="mailto:contact@saha-event.dz" className="text-text-light/60 hover:text-accent transition-colors text-sm">
                  contact@saha-event.dz
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Newsletter Subscription */}
          <div className="mb-8 glass-card-lg p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-text-light font-bold text-lg mb-1">Restez informé</h4>
                <p className="text-text-light/60 text-sm">Recevez nos dernières offres et nouvelles salles</p>
              </div>
              <div className="flex w-full md:w-auto gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="input-glass rounded-r-none flex-1 md:flex-none"
                />
                <button className="btn-gold rounded-l-none">
                  S&apos;abonner
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-light/50 text-sm">
              &copy; {currentYear} Saha Event. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6 text-sm text-text-light/50">
              <a href="#" className="hover:text-accent transition-colors">Sitemap</a>
              <a href="#" className="hover:text-accent transition-colors">Crédits</a>
              <a href="#" className="hover:text-accent transition-colors">Partenaires</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

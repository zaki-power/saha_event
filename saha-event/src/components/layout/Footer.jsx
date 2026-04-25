import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-white">Saha<span className="text-accent">-Event</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Trouvez la salle parfaite pour votre événement inoubliable. Réservez facilement et célébrez en confiance.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300 transform hover:scale-110">
                <FaFacebook className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-300 transform hover:scale-110">
                <FaInstagram className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300 transform hover:scale-110">
                <FaTwitter className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300 transform hover:scale-110">
                <FaLinkedin className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Accès Rapide</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  Rechercher une salle
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  Centre d&apos;aide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  Conditions d&apos;utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Nous Contacter</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-accent mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Cité 1200 Logements<br />
                  Alger, Algérie
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-accent mr-3 flex-shrink-0" />
                <a href="tel:+213555123456" className="text-gray-400 hover:text-accent transition-colors text-sm">
                  +213 (0) 555 12 34 56
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-accent mr-3 flex-shrink-0" />
                <a href="mailto:contact@saha-event.dz" className="text-gray-400 hover:text-accent transition-colors text-sm">
                  contact@saha-event.dz
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Newsletter Subscription */}
          <div className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-xl border border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-white font-bold text-lg mb-1">Restez informé</h4>
                <p className="text-gray-400 text-sm">Recevez nos dernières offres et nouvelles salles</p>
              </div>
              <div className="flex w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="px-4 py-2 rounded-l-lg bg-gray-800 text-white placeholder-gray-500 outline-none flex-1 md:flex-none"
                />
                <button className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-r-lg font-bold transition-colors duration-300">
                  S&apos;abonner
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Saha Event. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
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

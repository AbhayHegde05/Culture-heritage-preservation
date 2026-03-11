import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: 'Heritage Sites', href: '/care-the-culture' },
      { name: 'Explore Places', href: '/explore' },
      { name: 'Top Destinations', href: '/explore?tab=top' },
      { name: 'Nearby Sites', href: '/explore?tab=nearby' },
    ],
    support: [
      { name: 'Donate', href: '/donate' },
      { name: 'Volunteer', href: '/about#volunteer' },
      { name: 'Partners', href: '/about#partners' },
      { name: 'Contact Us', href: '/about#contact' },
    ],
    resources: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Mission', href: '/about#mission' },
      { name: 'Documentation', href: '/about#docs' },
      { name: 'Privacy Policy', href: '/about#privacy' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: '📘' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'LinkedIn', href: '#', icon: '💼' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Culture Heritage</h3>
                <p className="text-sm text-gray-400">Preserving Our Past, Enriching Our Future</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              We are dedicated to preserving and showcasing the rich cultural heritage sites 
              across the world. Through digital technology, we make it possible for everyone 
              to explore and learn about our precious historical treasures.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <EnvelopeIcon className="w-4 h-4" />
                <span className="text-sm">info@cultureheritage.org</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <PhoneIcon className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPinIcon className="w-4 h-4" />
                <span className="text-sm">123 Heritage Street, Cultural District</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              Explore
            </h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <HeartIcon className="w-5 h-5 mr-2" />
              Support
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <AcademicCapIcon className="w-5 h-5 mr-2" />
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-lg font-semibold mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-sm">
                Subscribe to our newsletter to receive updates about new heritage sites, 
                preservation efforts, and cultural events.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Follow us:</span>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © {currentYear} Culture Heritage Preservation. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-2 justify-center md:justify-end">
                <Link to="/about#privacy" className="text-xs text-gray-400 hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/about#terms" className="text-xs text-gray-400 hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
                <Link to="/about#sitemap" className="text-xs text-gray-400 hover:text-primary-400 transition-colors">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Pattern */}
      <div className="h-2 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600"></div>
    </footer>
  );
};

export default Footer;

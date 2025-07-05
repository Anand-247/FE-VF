"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import { settingsAPI } from "../utils/api"

const Footer = () => {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getPublic()
      setSettings(response.data)
    } catch (error) {
      console.error("Error fetching settings:", error)
      // Fallback settings if API fails
      setSettings({
        shopAddress: "123 Furniture Ave, Woodville, PA 12345",
        shopPhone: "+1 (555) 123-4567",
        shopEmail: "info@woodcraft.com",
        socialMedia: {
          facebook: "https://facebook.com/woodcraft",
          instagram: "https://instagram.com/woodcraft",
          twitter: "https://twitter.com/woodcraft",
          linkedin: "https://linkedin.com/company/woodcraft",
        },
      })
    }
  }

  return (
    <footer className="bg-gray-50 text-gray-700 py-10 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-8 text-center md:text-left">

          {/* Company Info & Branding */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center space-x-2 mb-3 group">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <span className="text-white font-bold text-sm md:text-xl">VF</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span class="text-lg sm:text-xl md:text-2xl font-bold text-gray-400 bg-clip-text ">
                  Verma
                </span>
                <span className="text-xs text-gray-500 font-medium -mt-1">Furniture Works</span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs mb-5">
              Crafting exquisite wooden furniture, blending artistry with modern design.
            </p>
            <div className="flex space-x-3">
              {settings.socialMedia?.facebook && (
                <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors transform hover:scale-110" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
              )}
              {settings.socialMedia?.instagram && (
                <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-500 transition-colors transform hover:scale-110" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              )}
              {settings.socialMedia?.twitter && (
                <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors transform hover:scale-110" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
              )}
              {settings.socialMedia?.linkedin && (
                <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition-colors transform hover:scale-110" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:border-l md:border-gray-200 md:pl-8">
            <h4 className="text-base font-semibold mb-3 text-gray-800 border-b border-gray-300 pb-1.5 inline-block">
              Explore
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-amber-600 transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-amber-600 transition-colors">Products</Link></li>
              <li><Link to="/categories" className="text-gray-600 hover:text-amber-600 transition-colors">Categories</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-amber-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-amber-600 transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-amber-600 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:border-l md:border-gray-200 md:pl-8">
            <h4 className="text-base font-semibold mb-3 text-gray-800 border-b border-gray-300 pb-1.5 inline-block">
              Contact Us
            </h4>
            <div className="space-y-2 text-sm">
              {settings.shopAddress && (
                <div className="flex items-start space-x-2.5">
                  <MapPin size={16} className="text-amber-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-600 leading-tight">{settings.shopAddress}</p>
                </div>
              )}
              {settings.shopPhone && (
                <div className="flex items-center space-x-2.5">
                  <Phone size={16} className="text-amber-600" />
                  <p className="text-gray-600">
                    <a href={`tel:${settings.shopPhone}`} className="hover:text-amber-600 transition-colors">
                      {settings.shopPhone}
                    </a>
                  </p>
                </div>
              )}
              {settings.shopEmail && (
                <div className="flex items-center space-x-2.5">
                  <Mail size={16} className="text-amber-600" />
                  <p className="text-gray-600">
                    <a href={`mailto:${settings.shopEmail}`} className="hover:text-amber-600 transition-colors">
                      {settings.shopEmail}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-10 pt-5 text-center">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Verma Furniture Works. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Crafted with <span className="text-red-500">&#x2764;</span> in Hisar, Haryana, India.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
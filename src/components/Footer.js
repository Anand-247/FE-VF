"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"
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
    }
  }

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">WoodCraft</h3>
                <p className="text-sm text-gray-400">Furniture Store</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Crafting beautiful wooden furniture with passion and precision. Quality craftsmanship for your home and
              office.
            </p>
            <div className="flex space-x-4">
              {settings.socialMedia?.facebook && (
                <a
                  href={settings.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  <Facebook size={20} />
                </a>
              )}
              {settings.socialMedia?.instagram && (
                <a
                  href={settings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
              {settings.socialMedia?.twitter && (
                <a
                  href={settings.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              {settings.shopAddress && (
                <div className="flex items-start space-x-3">
                  <MapPin size={18} className="text-amber-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-400">{settings.shopAddress}</p>
                </div>
              )}
              {settings.shopPhone && (
                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-amber-500" />
                  <p className="text-gray-400">{settings.shopPhone}</p>
                </div>
              )}
              {settings.shopEmail && (
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-amber-500" />
                  <p className="text-gray-400">{settings.shopEmail}</p>
                </div>
              )}
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
            <div className="space-y-2 text-gray-400">
              {settings.businessHours ? (
                Object.entries(settings.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize">{day}:</span>
                    <span>{hours || "Closed"}</span>
                  </div>
                ))
              ) : (
                <div>
                  <div className="flex justify-between">
                    <span>Mon - Fri:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} WoodCraft Furniture Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

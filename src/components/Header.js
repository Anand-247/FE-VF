"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react" // Removed Cross as X is used
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"
import { categoryAPI } from "../utils/api"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const { getCartItemsCount, isLoaded } = useCart()
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu or categories dropdown when navigating
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
  }, [location.pathname]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll()
      setCategories(response.data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsSearchVisible(false) // Hide search bar after search
      setIsMenuOpen(false); // Close menu if open
    }
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const cartItemsCount = isLoaded ? getCartItemsCount() : 0

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50" : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <span className="text-white font-bold text-sm md:text-xl">VF</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900"> {/* Changed text-gray-400 to text-gray-900 for better visibility */}
                Verma
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">Furniture Works</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative text-sm font-semibold transition-all duration-300 hover:text-blue-600 group ${
                  location.pathname === item.href ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full ${
                    location.pathname === item.href ? "w-full" : ""
                  }`}
                ></span>
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group"
              >
                <span>Categories</span>
                <ChevronDown
                  size={16}
                  className={`transition-all duration-300 group-hover:text-blue-600 ${
                    isCategoriesOpen ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 z-50 animate-fadeInUp">
                  <div className="px-4 pb-3 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900">Browse Categories</h3>
                    <p className="text-xs text-gray-500 mt-1">Discover our furniture collections</p>
                  </div>
                  <div className="py-2 max-h-80 overflow-y-auto">
                    {categories.slice(0, 8).map((category) => (
                      <Link
                        key={category._id}
                        to={`/categories/${category.slug}`}
                        className="flex items-center space-x-4 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {category.image?.url && (
                          <div className="relative">
                            <img
                              src={category.image.url || "/placeholder.svg"}
                              alt={category.name}
                              className="w-12 h-12 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {category.name}
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">Premium collection</p>
                        </div>
                        <ChevronDown
                          size={14}
                          className="rotate-[-90deg] text-gray-400 group-hover:text-blue-600 transition-colors duration-300"
                        />
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-3 px-4">
                    <Link
                      to="/categories"
                      className="flex items-center justify-center space-x-2 w-full py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      <span>View All Categories</span>
                      <ChevronDown size={14} className="rotate-[-90deg]" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8"> {/* Changed md:block to lg:block to align with lg:flex nav */}
            <form onSubmit={handleSearch} className="relative group">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for furniture, decor, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-500 group-hover:bg-white group-hover:border-gray-300"
                />
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10"></div>
            </form>
          </div>

          {/* Right Actions & Hamburger */}
          <div className="flex items-center space-x-2">
            {/* Search Icon (visible on mobile/tablet) */}
            <button
              onClick={() => {
                setIsSearchVisible((prev) => !prev)
                setIsCategoriesOpen(false)
                setIsMenuOpen(false) // Close mobile menu if open when search is toggled
              }}
              className="lg:hidden flex items-center justify-center w-11 h-11 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
            >
              {isSearchVisible ? <X size={20} className="group-hover:scale-110 translate-transform duration-300" /> : <Search size={20} className="group-hover:scale-110 transition-transform duration-300" />}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-11 h-11 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 group"
            >
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform duration-300" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </Link>

            {/* Hamburger Menu Icon (visible on mobile/tablet) */}
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen)
                setIsCategoriesOpen(false) // Close categories if open when menu is toggled
                setIsSearchVisible(false) // Hide search bar if open when menu is toggled
              }}
              className="lg:hidden flex items-center justify-center w-11 h-11 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Input (conditionally rendered) */}
      {isSearchVisible && (
        <div className="px-4 pb-4 md:hidden"> {/* Only show on md screens and below */}
          <form onSubmit={handleSearch} className="group">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-500"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu Content (conditionally rendered) */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg py-6 px-4 overflow-auto h-screen">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block text-lg font-semibold transition-colors duration-300 ${
                  location.pathname === item.href ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setIsMenuOpen(false)} // Close menu on item click
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Categories */}
          <div className="border-t border-gray-100 pt-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category._id}
                  to={`/categories/${category.slug}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.image?.url && (
                    <img
                      src={category.image.url || "/placeholder.svg"}
                      alt={category.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
            {/* <Link
              to="/categories"
              className="block mt-4 text-center py-3 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              View All Categories
            </Link> */}
          </div>
        </div>
      )}

      {/* Categories Dropdown Overlay (for desktop) */}
      {isCategoriesOpen && (
        <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm" onClick={() => setIsCategoriesOpen(false)} />
      )}
    </header>
  )
}

export default Header
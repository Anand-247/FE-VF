"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Star } from "lucide-react"
import { bannerAPI } from "../utils/api"

const Banner = () => {
  const [banners, setBanners] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length > 1 && isAutoPlaying) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentSlide((prev) => (prev + 1) % banners.length)
            return 0
          }
          return prev + 2
        })
      }, 100)
      return () => clearInterval(timer)
    }
  }, [banners.length, isAutoPlaying])

  const fetchBanners = async () => {
    try {
      const response = await bannerAPI.getAll()
      setBanners(response.data || [])
    } catch (error) {
      console.error("Error fetching banners:", error)
      setBanners([
        {
          _id: "default-1",
          title: "Premium Wooden Furniture",
          subtitle: "Crafted with Excellence",
          description:
            "Discover our exclusive collection of handcrafted wooden furniture that brings elegance and warmth to your home",
          image: { url: "/placeholder.svg?height=600&width=1200" },
          buttonText: "Shop Collection",
          buttonLink: "/products",
          isActive: true,
        },
        {
          _id: "default-2",
          title: "Modern Living Spaces",
          subtitle: "Contemporary Designs",
          description:
            "Transform your living space with our modern furniture collection featuring clean lines and premium materials",
          image: { url: "/placeholder.svg?height=600&width=1200" },
          buttonText: "Explore Now",
          buttonLink: "/categories",
          isActive: true,
        },
        {
          _id: "default-3",
          title: "Bedroom Essentials",
          subtitle: "Comfort & Style",
          description: "Create your perfect sanctuary with our comfortable and stylish bedroom furniture collection",
          image: { url: "/placeholder.svg?height=600&width=1200" },
          buttonText: "View Bedroom",
          buttonLink: "/categories/bedroom",
          isActive: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setProgress(0)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
    setProgress(0)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
    setProgress(0)
  }

  const togglePlayPause = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  if (loading) {
    return (
      <div className="relative h-96 lg:h-[600px] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-2xl overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 animate-pulse"></div>
            <div className="h-8 bg-gray-300 rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded-lg w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  const activeBanners = banners.filter((banner) => banner.isActive !== false)

  if (!activeBanners.length) {
    return (
      <div className="relative h-96 lg:h-[600px] bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="text-center text-white relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold mb-6 border border-white/20">
            <Sparkles size={16} />
            <span>Welcome to WoodCraft</span>
          </div>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Premium Wooden Furniture
          </h2>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Discover our exclusive collection of handcrafted furniture that brings elegance to your home
          </p>
          <a
            href="/products"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <span>Shop Now</span>
            <ChevronRight size={20} className="ml-2" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden group shadow-2xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Banner Slides */}
      <div className="relative h-full">
        {activeBanners.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : index < currentSlide
                  ? "opacity-0 scale-110 -translate-x-full"
                  : "opacity-0 scale-110 translate-x-full"
            }`}
          >
            <img
              src={banner.image?.url || "/placeholder.svg?height=600&width=1200"}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

            {/* Enhanced Banner Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                  {banner.subtitle && (
                    <div
                      className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-bold mb-6 border border-white/20"
                      style={{
                        animation: index === currentSlide ? "fadeInUp 0.8s ease-out 0.2s both" : "none",
                      }}
                    >
                      <Star size={16} />
                      <span>{banner.subtitle}</span>
                    </div>
                  )}

                  <h2
                    className="text-4xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                    style={{
                      animation: index === currentSlide ? "fadeInUp 0.8s ease-out 0.4s both" : "none",
                    }}
                  >
                    <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                      {banner.title}
                    </span>
                  </h2>

                  {banner.description && (
                    <p
                      className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl"
                      style={{
                        animation: index === currentSlide ? "fadeInUp 0.8s ease-out 0.6s both" : "none",
                      }}
                    >
                      {banner.description}
                    </p>
                  )}

                  {banner.buttonText && (
                    <div
                      className="flex flex-col sm:flex-row gap-4"
                      style={{
                        animation: index === currentSlide ? "fadeInUp 0.8s ease-out 0.8s both" : "none",
                      }}
                    >
                      <a
                        href={banner.buttonLink || "/products"}
                        className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                      >
                        <span>{banner.buttonText}</span>
                        <ChevronRight size={20} className="ml-2" />
                      </a>
                      <button className="inline-flex items-center text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                        <Play size={20} className="mr-2" />
                        Watch Video
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-4 px-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/20 shadow-xl"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-4 px-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/20 shadow-xl"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Enhanced Bottom Controls */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="p-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-xl"
          >
            {isAutoPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Enhanced Dots Indicator */}
          <div className="flex space-x-3">
            {activeBanners.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className="relative group">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white scale-125 shadow-lg"
                      : "bg-white/50 hover:bg-white/75 hover:scale-110"
                  }`}
                />
                {index === currentSlide && (
                  <div
                    className="absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                    style={{
                      clipPath: `inset(0 ${100 - progress}% 0 0)`,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Progress Bar */}
      {activeBanners.length > 1 && isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
          <div
            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-100 ease-linear shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000 opacity-30"></div>
    </div>
  )
}

export default Banner

"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from "lucide-react"
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
          return prev + 1.5
        })
      }, 80)
      return () => clearInterval(timer)
    }
  }, [banners.length, isAutoPlaying, currentSlide])

  const fetchBanners = async () => {
    try {
      // Simulate API call - replace with actual API call
      const response = await bannerAPI.getAll()
      setBanners(response.data || [])
      
      // Mock data for demonstration
      // setBanners([
      //   {
      //     _id: "1",
      //     title: "Premium Wooden Furniture",
      //     description: "Transform your space with our exquisite collection of handcrafted wooden furniture",
      //     image: { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&h=800&fit=crop" },
      //     isActive: true,
      //   },
      //   {
      //     _id: "2",
      //     title: "Modern Living Solutions",
      //     description: "Discover furniture that perfectly blends style, comfort, and functionality",
      //     image: { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&h=800&fit=crop" },
      //     isActive: true,
      //   },
      //   {
      //     _id: "3",
      //     title: "Luxury Bedroom Collection",
      //     description: "Create your perfect sanctuary with our premium bedroom furniture",
      //     image: { url: "https://images.unsplash.com/photo-1631079642576-2e3f1c1b8b5e?w=1400&h=800&fit=crop" },
      //     isActive: true,
      //   },
      // ])
    } catch (error) {
      console.error("Error fetching banners:", error)
      setBanners([
        {
          _id: "default-1",
          title: "Premium Wooden Furniture",
          description: "Transform your space with our exquisite collection of handcrafted wooden furniture",
          image: { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&h=800&fit=crop" },
          isActive: true,
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setProgress(0)
    // Temporarily pause autoplay when manually navigating
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000) // Resume after 3 seconds
  }

  const goToPrevious = () => {
    const activeBanners = banners.filter((banner) => banner.isActive !== false)
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
    setProgress(0)
  }

  const goToNext = () => {
    const activeBanners = banners.filter((banner) => banner.isActive !== false)
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length)
    setProgress(0)
  }

  const togglePlayPause = (e) => {
    e.stopPropagation()
    e.preventDefault()
    console.log("🚀 ~ togglePlayPause ~ isAutoPlaying:", isAutoPlaying)
    setIsAutoPlaying(!isAutoPlaying)
    // if (!isAutoPlaying) {
    //   setProgress(0)
    // }
  }

  if (loading) {
    return (
      <div className="w-full max-w-9xl mx-auto p-4 sm:p-6 lg:p-8 mb-8">
        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto animate-pulse"></div>
              <div className="h-8 bg-slate-300 rounded-lg w-64 mx-auto animate-pulse"></div>
              <div className="h-4 bg-slate-300 rounded-lg w-48 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const activeBanners = banners.filter((banner) => banner.isActive !== false)

  if (!activeBanners.length) {
    return (
      <div className="w-full max-w-9xl mx-auto p-4 sm:p-6 lg:p-8 mb-8">
        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center text-white max-w-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Premium Wooden Furniture
              </h2>
              <p className="text-lg lg:text-xl text-slate-200 leading-relaxed">
                Discover our exclusive collection of handcrafted furniture
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-9xl mx-auto p-4 sm:p-6 lg:p-8 mb-8">
      <div
        className="relative h-[200px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group"
        // onMouseEnter={() => setIsAutoPlaying(false)}
        // onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Background Slides */}
        <div className="absolute inset-0">
          {activeBanners.map((banner, index) => (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              <img
                src={banner.image?.url || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&h=800&fit=crop"}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60"></div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex mt-10 md:mt-0 md:items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-6">
            {activeBanners.map((banner, index) => (
              <div
                key={banner._id}
                className={`transition-all duration-700 ${
                  index === currentSlide
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform translate-y-8"
                }`}
                style={{
                  display: index === currentSlide ? "block" : "none",
                }}
              >
                {/* Main Title */}
                <h1 className="text-lg sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  {banner.title}
                </h1>

                {/* Description */}
                <p className="text-md sm:text-xl md:text-2xl text-slate-200 leading-relaxed max-w-3xl mx-auto">
                  {banner.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30 opacity-80 group-hover:opacity-100 flex items-center justify-center hover:scale-110 z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30 opacity-80 group-hover:opacity-100 flex items-center justify-center hover:scale-110 z-20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Bottom Controls */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center z-10 gap-6">
            {/* Play/Pause Button */}
            {/* <button
              onClick={togglePlayPause}
              className="w-8 sm:w-12 h-8 sm:h-12 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center hover:scale-110"
              aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
            >
              {isAutoPlaying ? (
                <Pause className="w-4 sm:w-5 h-4 sm:h-5" />
              ) : (
                <Play className="w-4 sm:w-5 h-4 sm:h-5 ml-0.5" />
              )}
            </button> */}

            {/* Slide Indicators */}
            <div className="flex items-center gap-3">
              {activeBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="relative group"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div
                    className={`w-3 sm:w-4 h-3 sm:h-4 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                  {index === currentSlide && (
                    <div
                      className="absolute inset-0 w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-100"
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

        {/* Progress Bar */}
        {activeBanners.length > 1 && isAutoPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Banner
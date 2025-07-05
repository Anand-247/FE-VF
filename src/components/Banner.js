"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  Star,
  Sparkles,
  ShoppingBag
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
          subtitle: "Handcrafted Excellence",
          description: "Transform your space with our exquisite collection of handcrafted wooden furniture",
          image: { url: "/placeholder.svg?height=800&width=1400" },
          buttonText: "Shop Now",
          buttonLink: "/products",
          isActive: true,
        },
        {
          _id: "default-2",
          title: "Modern Living Solutions",
          subtitle: "Contemporary Design",
          description: "Discover furniture that perfectly blends style, comfort, and functionality",
          image: { url: "/placeholder.svg?height=800&width=1400" },
          buttonText: "Explore Collection",
          buttonLink: "/categories",
          isActive: true,
        },
        {
          _id: "default-3",
          title: "Luxury Bedroom Sets",
          subtitle: "Comfort & Elegance",
          description: "Create your perfect sanctuary with our premium bedroom furniture collection",
          image: { url: "/placeholder.svg?height=800&width=1400" },
          buttonText: "View Bedrooms",
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative h-[500px] sm:h-[400px] lg:h-[500px] xl:h-[600px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto animate-pulse"></div>
              <div className="h-6 sm:h-8 bg-slate-300 rounded-lg w-48 sm:w-64 mx-auto animate-pulse"></div>
              <div className="h-4 bg-slate-300 rounded-lg w-32 sm:w-48 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const activeBanners = banners.filter((banner) => banner.isActive !== false)

  if (!activeBanners.length) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative h-[500px] sm:h-[400px] lg:h-[500px] xl:h-[600px] bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center text-white max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-white/20">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Welcome to WoodCraft</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Premium Wooden Furniture
              </h2>
              <p className="text-sm sm:text-lg lg:text-xl text-slate-200 mb-6 sm:mb-8 leading-relaxed">
                Discover our exclusive collection of handcrafted furniture
              </p>
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl text-sm sm:text-base">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Shop Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div
        className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] rounded-3xl overflow-hidden shadow-2xl group"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
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
                src={banner.image?.url || "/placeholder.svg?height=800&width=1400"}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
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
                {/* Subtitle Badge */}
                {banner.subtitle && (
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs sm:text-sm font-medium mb-3 sm:mb-4 border border-white/20">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{banner.subtitle}</span>
                  </div>
                )}

                {/* Main Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
                  <span className="bg-clip-text ">
                    {banner.title}
                  </span>
                </h1>

                {/* Description */}
                {banner.description && (
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-slate-200 mb-4 sm:mb-6 lg:mb-8 leading-relaxed max-w-2xl">
                    {banner.description}
                  </p>
                )}

                {/* Action Buttons */}
                {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {banner.buttonText && (
                    <a
                      href={banner.buttonLink || "/products"}
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl group text-xs sm:text-base"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                      <span>{banner.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-transform group-hover:translate-x-1" />
                    </a>
                  )}
                </div> */}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 opacity-0 group-hover:opacity-100 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 opacity-0 group-hover:opacity-100 flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Bottom Controls */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 sm:gap-6">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center"
            >
              {isAutoPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Slide Indicators */}
            <div className="flex items-center gap-2 sm:gap-3">
              {activeBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="relative group"
                >
                  <div
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                  {index === currentSlide && (
                    <div
                      className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-100"
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

        {/* Decorative Elements */}
        <div className="absolute top-8 right-8 w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-16 left-8 w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-full animate-pulse delay-700"></div>
      </div>
    </div>
  )
}

export default Banner
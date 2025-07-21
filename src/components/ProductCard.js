"use client"

import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Star, Package, Truck, Zap, Shield } from "lucide-react"
import { useCart } from "../context/CartContext"
import toast from "react-hot-toast"

const IMAGE_CHANGE_INTERVAL = 3000   // ms for auto-sliding images
const PROGRESS_INTERVAL = 60         // ms for progress step

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  const imageCount = product.images?.length || 1
  const hasMultipleImages = imageCount > 1
  const progressRef = useRef() // to sync with updates

  // Cart functions
  const { addToCart, isInCart, getCartItem } = useCart()
  const cartItem = getCartItem(product._id)

  // Progress and auto image change logic
  useEffect(() => {
    if (!hasMultipleImages || !isAutoPlaying) return
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentImageIndex(idx => (idx + 1) % imageCount)
          return 0
        }
        return prev + 1.7 // Tweak to fill roughly in IMAGE_CHANGE_INTERVAL
      })
    }, PROGRESS_INTERVAL)
    return () => clearInterval(progressRef.current)
  }, [hasMultipleImages, isAutoPlaying, imageCount])

  useEffect(() => {
    setProgress(0)
  }, [currentImageIndex])

  // Pause auto-play when manually navigating images
  const handleDotClick = index => {
    setCurrentImageIndex(index)
    setProgress(0)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 2500)
  }

  // Cart logic
  const handleAddToCart = e => {
    e.stopPropagation()
    e.preventDefault()
    if (product.stock <= 0) {
      toast.error("Product is out of stock")
      return
    }
    if (cartItem && cartItem.quantity >= product.stock) {
      toast.error("Cannot add more than stock")
      return
    }
    addToCart(product, 1)
    // toast.success(`${product.name} added to cart!`, {
    //   icon: "🛒",
    //   style: {
    //     borderRadius: "10px",
    //     background: "#10B981",
    //     color: "#fff",
    //   },
    // })
  }

  // Discounts, ratings, etc.
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  const rating = product.rating || 4.5
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 100) + 10

  // Stock indicator
  const getStockStatus = () => {
    if (product.stock === 0) return { status: "out", color: "bg-red-500", text: "Out of Stock" }
    if (product.stock <= 5) return { status: "low", color: "bg-orange-500", text: "Low Stock" }
    if (product.stock <= 10) return { status: "medium", color: "bg-yellow-500", text: "Limited Stock" }
    return { status: "good", color: "bg-green-500", text: "In Stock" }
  }
  const stockInfo = getStockStatus()

  return (
    <div 
      className="group relative bg-white border border-gray-100 shadow-xl rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
    >
      {/* ======= IMAGE CAROUSEL ======= */}
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Images with fading and scaling animation */}
          {product.images?.slice(0, 5).map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={product.name}
              className={`
                absolute inset-0 object-cover w-full h-full transition-all duration-700 ease-in-out
                ${idx === currentImageIndex ? "opacity-100 scale-100 z-20" : "opacity-0 scale-105 z-10"}
              `}
              onLoad={() => setIsImageLoaded(true)}
              loading="lazy"
              draggable={false}
              style={{ pointerEvents: idx === currentImageIndex ? "auto" : "none" }}
            />
          ))}
          {/* Fallback image */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center animate-pulse">
              <Package size={32} className="text-gray-400" />
            </div>
          )}
          {/* Gradient Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          {/* Slide indicator dots — animated */}
          {hasMultipleImages && (
            <div className="flex items-center gap-3 absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={e => { e.preventDefault(); handleDotClick(idx) }}
                  className="relative group"
                  aria-label={`Go to image ${idx + 1}`}
                >
                  <div className={`
                    w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center
                    ${idx === currentImageIndex ? "bg-white scale-125 shadow" : "bg-white/50 hover:bg-white/75"}
                  `}/>
                  {/* Animated "arc" for current index */}
                  {idx === currentImageIndex && (
                    <div
                      className="absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-100 pointer-events-none"
                      style={{
                        clipPath: `inset(0 ${100 - progress}% 0 0)`,
                        zIndex: 1
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
          {/* Animated Progress Bar */}
          {hasMultipleImages && isAutoPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
              ⭐ Featured
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
              -{discountPercentage}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              🆕 New
            </span>
          )}
        </div>
        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="text-center text-white">
              <Package size={36} className="mx-auto mb-2 opacity-80" />
              <span className="font-bold text-lg">Out of Stock</span>
            </div>
          </div>
        )}
      </Link>

      {/* ======= DETAILS SECTION ======= */}
      <div className="p-5">
        {/* Category & Stock */}
        <div className="flex items-center justify-between mb-2">
          {product.category && (
            <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-full">
              {product.category.name}
            </span>
          )}
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(1)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`
                    ${i < Math.floor(rating) ? "text-yellow-400 fill-current" 
                    : i === Math.floor(rating) && rating % 1 >= 0.5
                    ? "text-yellow-400 fill-current" : "text-gray-300"}
                    transition-colors
                  `}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 font-medium">{rating}</span>
            {/* <span className="text-xs text-gray-400">({reviewCount})</span> */}
          </div>
        </div>
        {/* Name */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
            {product.name}
          </h3>
        </Link>
        {/* Price */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xl font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
          {discountPercentage > 0 && (
            <span className="text-sm font-semibold text-green-600">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
          )}
        </div>
        {/* Features */}
        {product.features?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 text-xs">
            {product.features.slice(0, 2).map((feature, idx) => (
              <span key={idx} className="bg-gray-100 border text-gray-600 px-2 py-1 rounded-full">{feature}</span>
            ))}
            {product.features.length > 2 && (
              <span className="text-gray-500 font-medium">+{product.features.length - 2} more</span>
            )}
          </div>
        )}
        {/* Trust indicators */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Truck size={12} />
            <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={12} />
            <span>Warranty</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={12} />
            <span>Fast Ship</span>
          </div>
        </div>
        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden
            ${product.stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isInCart(product._id)
                ? "bg-green-500 text-white shadow-lg"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"}
          `}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 
            ? "Out of Stock" 
            : isInCart(product._id) 
              ? `In Cart (${cartItem?.quantity || 0})` 
              : "Add to Cart"
          }
          {!isInCart(product._id) && product.stock > 0 && (
            <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
          )}
        </button>
        {/* Stock notice */}
        {product.stock > 0 && product.stock <= 10 && (
          <p className="text-xs text-center mt-2 text-orange-600 font-medium">
            Only {product.stock} left in stock!
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductCard

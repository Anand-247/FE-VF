"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Star, Package, Zap, Truck, Shield } from 'lucide-react'
import { useCart } from "../context/CartContext"
import toast from "react-hot-toast"

const ProductCard = ({ product }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { addToCart, isInCart, getCartItem } = useCart()

  useEffect(() => {
    if (product.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          (prevIndex + 1) % product.images.length
        )
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [product.images])

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.stock <= 0) {
      toast.error("Product is out of stock")
      return
    }

    const cartItem = getCartItem(product._id)
    if (cartItem && cartItem.quantity >= product.stock) {
      toast.error("Cannot add more items than available in stock")
      return
    }

    addToCart(product, 1)
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#10B981',
        color: '#fff',
      },
    })
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const rating = product.rating || 4.5
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 100) + 10
  const cartItem = getCartItem(product._id)
  const hasMultipleImages = product.images && product.images.length > 1

  const getStockStatus = () => {
    if (product.stock === 0) return { status: 'out', color: 'bg-red-500', text: 'Out of Stock' }
    if (product.stock <= 5) return { status: 'low', color: 'bg-orange-500', text: 'Low Stock' }
    if (product.stock <= 10) return { status: 'medium', color: 'bg-yellow-500', text: 'Limited Stock' }
    return { status: 'good', color: 'bg-green-500', text: 'In Stock' }
  }

  const stockInfo = getStockStatus()

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
      {/* Product Image Container */}
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <Package size={32} className="text-gray-400" />
          </div>
        )}

        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.images?.[currentImageIndex]?.url || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />

          {/* Image Navigation Dots */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 cursor-pointer z-10 transform -translate-x-1/2 flex gap-1">
              {product.images.slice(0, 3).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
                  className={`w-5 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
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

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-white">
              <Package size={32} className="mx-auto mb-2 opacity-75" />
              <span className="font-bold text-lg">Out of Stock</span>
            </div>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category & Stock Status */}
        <div className="flex items-center justify-between mb-2">
          {product.category && (
            <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-full">
              {product.category.name}
            </span>
          )}
          <div className={`w-2 h-2 rounded-full ${stockInfo.color}`} title={stockInfo.text}></div>
        </div>

        {/* Product Name */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(rating) 
                    ? "text-yellow-400 fill-current" 
                    : i === Math.floor(rating) && rating % 1 >= 0.5
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                } transition-colors`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">{rating}</span>
          <span className="text-xs text-gray-400">({reviewCount})</span>
        </div>

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
        {product.features && product.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.features.slice(0, 2).map((feature, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full border">
                {feature}
              </span>
            ))}
            {product.features.length > 2 && (
              <span className="text-xs text-gray-500 font-medium">+{product.features.length - 2} more</span>
            )}
          </div>
        )}

        {/* Trust Indicators */}
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

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
            product.stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isInCart(product._id)
                ? "bg-green-500 text-white shadow-lg"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          }`}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 
            ? "Out of Stock" 
            : isInCart(product._id) 
              ? `In Cart (${cartItem?.quantity || 0})` 
              : "Add to Cart"
          }
          
          {/* Button shine effect */}
          {!isInCart(product._id) && product.stock > 0 && (
            <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          )}
        </button>

        {/* Stock indicator */}
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
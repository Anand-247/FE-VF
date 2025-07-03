"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Star, Eye, Package } from 'lucide-react'
import { useCart } from "../context/CartContext"
import toast from "react-hot-toast"

const ProductCard = ({ product }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const { addToCart, isInCart, getCartItem } = useCart()

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
    toast.success(`${product.name} added to cart!`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success("Quick view opened")
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const rating = product.rating || 4.5
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 100) + 10
  const cartItem = getCartItem(product._id)

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden bg-gray-50">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <Package size={32} className="text-gray-400" />
          </div>
        )}

        <img
          src={product.images?.[0]?.url || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 h-50 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsImageLoaded(true)}
          loading="lazy"
        />

        <div className="h-50">
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                Featured
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                -{discountPercentage}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                Out of Stock
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                Low Stock
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
          >
            <button
              onClick={handleWishlist}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white"
              }`}
            >
              <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
            </button>

            <button
              onClick={handleQuickView}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-blue-500 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
            >
              <Eye size={16} />
            </button>
          </div>

          {/* Overlay for out of stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">{product.category.name}</p>
        )}

        {/* Product Name */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                } transition-colors`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">${product.price?.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">${product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.features.slice(0, 2).map((feature, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
            {product.features.length > 2 && (
              <span className="text-xs text-gray-500">+{product.features.length - 2} more</span>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            product.stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isInCart(product._id)
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105"
          }`}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? "Out of Stock" : isInCart(product._id) ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}

export default ProductCard

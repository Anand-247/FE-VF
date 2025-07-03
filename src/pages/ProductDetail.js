"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Ruler,
  Package,
  Plus,
  Minus,
  Share2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"
import UserForm from "../components/UserForm"
import { productAPI, settingsAPI } from "../utils/api"
import { generateWhatsAppMessage, openWhatsApp } from "../utils/whatsapp"
import toast from "react-hot-toast"

const ProductDetail = () => {
  const { productSlug } = useParams()
  const { addToCart } = useCart()
  const { user } = useUser()

  const [product, setProduct] = useState(null)
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showUserForm, setShowUserForm] = useState(false)
  const [selectedTab, setSelectedTab] = useState("description")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    if (productSlug) {
      fetchProductData()
    }
  }, [productSlug])

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getBySlug(productSlug)
      setProduct(response.data)

      // Fetch related products
      if (response.data?.category?._id) {
        const relatedResponse = await productAPI.getAll({
          category: response.data.category._id,
          limit: 4,
          exclude: response.data._id,
        })
        setRelatedProducts(relatedResponse.data?.products || [])
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Product not found")
    } finally {
      setLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getPublic()
      setSettings(response.data)
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error("Product is out of stock")
      return
    }

    addToCart(product, quantity)
    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
      style: {
        background: "#10B981",
        color: "white",
        borderRadius: "8px",
        padding: "12px 16px",
      },
    })
  }

  const handleBuyNow = (userData) => {
    if (!settings.whatsappNumber) {
      toast.error("WhatsApp number not configured")
      return
    }

    const message = generateWhatsAppMessage("buy_now", {
      user: userData,
      product,
      quantity,
    })

    openWhatsApp(settings.whatsappNumber, message)
    setShowUserForm(false)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const discountPercentage =
    product?.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const images =
    product.images?.length > 0 ? product.images : [{ url: "/placeholder.svg?height=500&width=500", alt: product.name }]

  const features = [
    { icon: Truck, title: "Free Shipping", description: "On orders over ₹25,000" },
    { icon: Shield, title: "2 Year Warranty", description: "Comprehensive coverage" },
    { icon: RotateCcw, title: "Easy Returns", description: "30-day return policy" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gray-900">
            Products
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/categories/${product.category.slug}`} className="hover:text-gray-900">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-square">
              <img
                src={images[selectedImageIndex]?.url || "/placeholder.svg"}
                alt={images[selectedImageIndex]?.alt || product.name}
                className="w-full h-full object-cover"
              />

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-sm">
                  -{discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === selectedImageIndex ? "border-gray-900" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              {product.category && (
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{product.category.name}</p>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>

              {product.isNewProduct && (
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  New Arrival
                </span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 transition-colors duration-200"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-50 transition-colors duration-200"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gray-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleWishlist}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    isWishlisted
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-4 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Share2 size={20} />
                </button>
              </div>

              <button
                onClick={() => setShowUserForm(true)}
                disabled={!product.inStock}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now via WhatsApp
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <feature.icon size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                    selectedTab === tab
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === "description" && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                {product.features && product.features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {selectedTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.dimensions && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Ruler size={18} />
                      <span>Dimensions</span>
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        Length: {product.dimensions.length} {product.dimensions.unit}
                      </p>
                      <p>
                        Width: {product.dimensions.width} {product.dimensions.unit}
                      </p>
                      <p>
                        Height: {product.dimensions.height} {product.dimensions.unit}
                      </p>
                    </div>
                  </div>
                )}

                {product.weight && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Package size={18} />
                      <span>Weight & Materials</span>
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p>Weight: {product.weight} kg</p>
                      {product.materials && product.materials.length > 0 && (
                        <div>
                          <p className="font-medium">Materials:</p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            {product.materials.map((material, index) => (
                              <li key={index}>{material}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTab === "reviews" && (
              <div className="text-center py-12">
                <Eye size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-500">Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <Link to={`/product/${relatedProduct.slug}`}>
                    <img
                      src={relatedProduct.images?.[0]?.url || "/placeholder.svg?height=200&width=200"}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                      <p className="text-lg font-bold text-gray-900">{formatPrice(relatedProduct.price)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Complete Your Order</h2>
                <button onClick={() => setShowUserForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ×
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.images?.[0]?.url || "/placeholder.svg?height=60&width=60"}
                    alt={product.name}
                    className="w-15 h-15 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {quantity} × {formatPrice(product.price)}
                    </p>
                    <p className="font-semibold text-gray-900">Total: {formatPrice(product.price * quantity)}</p>
                  </div>
                </div>
              </div>

              <UserForm onSubmit={handleBuyNow} buttonText="Send WhatsApp Message" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail

"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"
import UserForm from "../components/UserForm"
import { generateWhatsAppMessage, openWhatsApp } from "../utils/whatsapp"
import { settingsAPI } from "../utils/api"
import toast from "react-hot-toast"

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  console.log("🚀 ~ Cart ~ items:", items)
  const { user } = useUser()
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [settings, setSettings] = useState({})

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getPublic()
      setSettings(response.data)
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  useState(() => {
    fetchSettings()
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleCheckout = (userData) => {
    if (!settings.whatsappNumber) {
      toast.error("WhatsApp number not configured")
      return
    }

    const message = generateWhatsAppMessage("cart_checkout", {
      user: userData,
      items,
      total: getCartTotal(),
    })

    openWhatsApp(settings.whatsappNumber, message)
    setShowCheckoutForm(false)

    // Optionally clear cart after successful checkout
    // clearCart()
    toast.success("WhatsApp message sent! We'll contactnpm you soon.")
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some beautiful furniture to your cart to get started.</p>
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="border rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.images?.[0]?.url || "/placeholder.svg?height=100&width=100"}
                    alt={item.name}
                    className="w-14 h-16 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      <Link to={`/product/${item.slug}`} className="hover:text-amber-600 transition-colors">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{item.category?.name}</p>
                    <p className="font-semibold text-amber-600">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex-row items-center justify-center relative">
                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        className="absolute -top-4 -right-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    <div className="text-center">
                      <p className="font-semibold text-lg text-gray-800 mb-2">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <Link to="/" className="btn-secondary">
              Continue Shopping
            </Link>
            <button onClick={clearCart} className="text-red-500 hover:text-red-700 transition-colors">
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatPrice(getCartTotal())}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div> */}
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-amber-600">{formatPrice(getCartTotal())}</span>
              </div>
            </div>

            <button
              onClick={() => setShowCheckoutForm(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Checkout via WhatsApp
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Secure checkout powered by WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Complete Your Order</h2>
                <button onClick={() => setShowCheckoutForm(false)} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  {items.map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-amber-600">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              <UserForm onSubmit={handleCheckout} buttonText="Send WhatsApp Message" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart

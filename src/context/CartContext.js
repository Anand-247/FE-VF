import React, { createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("woodenFurnitureCart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart)
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage whenever items change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("woodenFurnitureCart", JSON.stringify(items))
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [items, isLoaded])

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    try {
      const existingItemIndex = items.findIndex(
        (item) => item._id === product._id && JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...items]
        updatedItems[existingItemIndex].quantity += quantity
        setItems(updatedItems)
        toast.success(`Updated ${product.name} quantity in cart`)
      } else {
        const newItem = {
          ...product,
          quantity,
          selectedVariant,
          addedAt: new Date().toISOString(),
        }
        setItems([...items, newItem])
        toast.success(`${product.name} added to cart`)
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add item to cart")
    }
  }

  const removeFromCart = (productId, selectedVariant = null) => {
    try {
      const updatedItems = items.filter(
        (item) => !(item._id === productId && JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant))
      )
      setItems(updatedItems)
      toast.success("Item removed from cart")
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast.error("Failed to remove item from cart")
    }
  }

  const updateQuantity = (productId, quantity, selectedVariant = null) => {
    try {
      if (quantity <= 0) {
        removeFromCart(productId, selectedVariant)
        return
      }

      const updatedItems = items.map((item) =>
        item._id === productId && JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
          ? { ...item, quantity }
          : item
      )
      setItems(updatedItems)
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast.error("Failed to update quantity")
    }
  }

  const clearCart = () => {
    try {
      setItems([])
      toast.success("Cart cleared")
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast.error("Failed to clear cart")
    }
  }

  const getCartItemsCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      const price = item.selectedVariant?.price || item.price || 0
      return total + price * item.quantity
    }, 0)
  }

  const isInCart = (productId, selectedVariant = null) => {
    return items.some(
      (item) => item._id === productId && JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
    )
  }

  const getCartItem = (productId, selectedVariant = null) => {
    return items.find(
      (item) => item._id === productId && JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
    )
  }

  const value = {
    items,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount,
    getCartTotal,
    isInCart,
    getCartItem,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

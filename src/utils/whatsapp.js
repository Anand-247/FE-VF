export const generateWhatsAppMessage = (type, data) => {
  const { user, items, total, product, quantity } = data

  let message = `Hello! I'm interested in placing an order.\n\n`

  // Customer details
  if (user) {
    message += `*Customer Details:*\n`
    message += `Name: ${user.name}\n`
    message += `Phone: ${user.phone}\n`
    message += `Address: ${user.address}\n\n`
  }

  if (type === "buy_now") {
    message += `*Product:*\n`
    message += `${product.name}\n`
    message += `Price: ₹${product.price}\n`
    message += `Quantity: ${quantity}\n`
    message += `Total: ₹${product.price * quantity}\n\n`
  } else if (type === "cart_checkout") {
    message += `*Order Details:*\n`
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`
      message += `   Price: ₹${item.product.price}\n`
      message += `   Quantity: ${item.quantity}\n`
      message += `   Subtotal: ₹${item.product.price * item.quantity}\n\n`
    })
    message += `*Total Amount: ₹${total}*\n\n`
  }

  message += `Please confirm the order and let me know the delivery details.`

  return encodeURIComponent(message)
}

export const openWhatsApp = (phoneNumber, message) => {
  const url = `https://wa.me/${phoneNumber}?text=${message}`
  window.open(url, "_blank")
}

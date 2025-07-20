export const generateWhatsAppMessage = (type, data) => {
  const { user, items, total, product, quantity } = data;
  console.log("WhatsApp Data:", data);
  const baseUrl = window.location.origin;



  let message = `*🛒 Hello! I'd like to place an order.*\n\n`;

  // Customer details
  if (user) {
    message += `*👤 Customer Details:*\n`;
    message += `• Name: ${user.name}\n`;
    message += `• Phone: ${user.phone}\n`;
    message += `• Address: ${user.address}\n\n`;
  }

  if (type === "buy_now" && product) {
    message += `*🛍️ Product Details:*\n`;
    message += `• Product: ${product.name}\n`;
    message += `• Price: ₹${product.price}\n`;
    message += `• Quantity: ${quantity}\n`;
    message += `• Total: ₹${product.price * quantity}\n\n`;
    message += `🔗 ${baseUrl}/product/${product.slug}\n\n`;
  } else if (type === "cart_checkout" && Array.isArray(items)) {
    message += `*🛒 Cart Items:*\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   • Price: ₹${item.price}\n`;
      message += `   • Quantity: ${item.quantity}\n`;
      message += `   • Subtotal: ₹${item.price * item.quantity}\n\n`;
      message += `   🔗 ${baseUrl}/product/${item.slug}\n\n`
    });

    message += `*💰 Total Amount: ₹${total}*\n\n`;
  }

  message += `_Please confirm my order and share the delivery details._`;

  return encodeURIComponent(message);
};

export const openWhatsApp = (phoneNumber, message) => {
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, "_blank");
};

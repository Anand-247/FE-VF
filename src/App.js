import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"

// Components
import Header from "./components/Header"
import Footer from "./components/Footer"

// Pages
import Home from "./pages/Home"
import Categories from "./pages/Categories"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Search from "./pages/Search"

// Context
import { CartProvider } from "./context/CartContext"
import { UserProvider } from "./context/UserContext"
import { useEffect } from "react"

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories/:categorySlug" element={<Categories />} />
                <Route path="/product/:productSlug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-center" />
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  )
}

export default App

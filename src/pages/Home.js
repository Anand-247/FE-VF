"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Star, Shield, Truck, Headphones, RotateCcw } from "lucide-react"
import Banner from "../components/Banner"
import ProductCard from "../components/ProductCard"
import CategoryCard from "../components/CategoryCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { productAPI, categoryAPI } from "../utils/api"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    customers: 10000,
    products: 500,
    orders: 25000,
    satisfaction: 98,
  })

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      const [productsResponse, categoriesResponse] = await Promise.all([
        productAPI.getAll({ featured: true, limit: 8 }),
        categoryAPI.getAll({ limit: 6 }),
      ])

      setFeaturedProducts(productsResponse.data.products || [])
      setCategories(categoriesResponse.data || [])
    } catch (error) {
      console.error("Error fetching home data:", error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "Premium materials and craftsmanship with lifetime warranty on all wooden furniture pieces.",
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Complimentary white-glove delivery and setup service for orders over $500 nationwide.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Expert customer service team available around the clock to assist with your needs.",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day hassle-free return policy with full refund if you're not completely satisfied.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Interior Designer",
      content:
        "The quality of furniture from WoodCraft is exceptional. Every piece is crafted with attention to detail and the customer service is outstanding.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Chen",
      role: "Homeowner",
      content:
        "I've furnished my entire home with WoodCraft pieces. The durability and timeless design make it worth every penny.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emily Rodriguez",
      role: "Architect",
      content:
        "As an architect, I recommend WoodCraft to all my clients. Their furniture perfectly complements modern and traditional spaces.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading home page..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative">
        <Banner />
      </section>

      {/* Features Section */}
      {/* <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose WoodCraft?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional furniture and service that exceeds your expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-gray-600">Discover our carefully curated furniture collections</p>
            </div>
            {/* <Link
              to="/categories"
              className="hidden md:flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              <span>View All</span>
              <ArrowRight size={18} />
            </Link> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/categories"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              <span>View All Categories</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-gray-600">Handpicked favorites from our premium collection</p>
            </div>
            {/* <Link
              to="/products"
              className="hidden md:flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              <span>View All</span>
              <ArrowRight size={18} />
            </Link> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* <div className="text-center mt-8 md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              <span>View All Products</span>
              <ArrowRight size={18} />
            </Link>
          </div> */}
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Join our growing community of satisfied customers who have transformed their homes with our furniture.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{stats.customers.toLocaleString()}+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{stats.products}+</div>
              <div className="text-blue-100">Premium Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{stats.orders.toLocaleString()}+</div>
              <div className="text-blue-100">Orders Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{stats.satisfaction}%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our customers have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default Home

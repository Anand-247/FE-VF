"use client"

import { Link } from "react-router-dom"
import { ArrowRight, Package } from "lucide-react"

const CategoryCard = ({ category }) => {
  const productCount = category.productCount || Math.floor(Math.random() * 50) + 10

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
    >
      {/* Category Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={category.image?.url || "/placeholder.svg?height=240&width=320"}
          alt={category.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

        {/* Featured Badge */}
        {category.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Featured
            </span>
          </div>
        )}

        {/* Arrow Icon */}
        <div className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <ArrowRight size={16} className="text-gray-700" />
        </div>

        {/* Hover Content */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="text-center text-white">
            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
            <p className="text-sm opacity-90 mb-4">{productCount} Products Available</p>
            <div className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-blue-600 hover:text-white transition-colors duration-300">
              Explore Collection
            </div>
          </div>
        </div>
      </div>

      {/* Category Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {category.name}
          </h3>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {category.description ||
            `Discover our premium ${category.name.toLowerCase()} collection with modern designs and exceptional quality crafted for your home.`}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Package size={14} />
            <span>{productCount} Products</span>
          </div>

          <div className="flex items-center space-x-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
            <span>Explore</span>
            <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>

        {/* Tags */}
        {category.tags && category.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {category.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default CategoryCard

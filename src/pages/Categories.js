"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import ProductList from "../components/ProductList"
import LoadingSpinner from "../components/LoadingSpinner"
import { categoryAPI, productAPI } from "../utils/api"
import { SortAsc } from "lucide-react"

const Categories = () => {
  const { categorySlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    page: Number.parseInt(searchParams.get("page")) || 1,
    limit: 12,
  })

  useEffect(() => {
    if (categorySlug) {
      fetchCategoryData()
    }
  }, [categorySlug, filters])

  const fetchCategoryData = async () => {
    try {
      setLoading(true)

      // Fetch category details
      const categoryResponse = await categoryAPI.getBySlug(categorySlug)
      setCategory(categoryResponse.data)

      // Fetch products in this category
      const productsResponse = await productAPI.getAll({
        category: categoryResponse.data._id,
        ...filters,
      })

      setProducts(productsResponse.data.products)
      setPagination(productsResponse.data.pagination)
    } catch (error) {
      console.error("Error fetching category data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFilters(updatedFilters)

    // Update URL params
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && key !== "limit") {
        params.set(key, value.toString())
      }
    })
    setSearchParams(params)
  }

  const handlePageChange = (page) => {
    const updatedFilters = { ...filters, page }
    setFilters(updatedFilters)

    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    setSearchParams(params)
  }

  if (loading && !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading category..." />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h1>
          <p className="text-gray-600">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          {category.image?.url && (
            <img
              src={category.image.url || "/placeholder.svg"}
              alt={category.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
            {category.description && <p className="text-gray-600 mt-2">{category.description}</p>}
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{pagination.total || 0} products found</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <SortAsc size={18} className="text-gray-500" />
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-")
                handleFilterChange({ sortBy, sortOrder })
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <ProductList
        products={products}
        loading={loading}
        emptyMessage={`No products found in ${category.name} category.`}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-12">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 border rounded-lg ${
                page === pagination.current
                  ? "bg-amber-600 text-white border-amber-600"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.pages}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Categories

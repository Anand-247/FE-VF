"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { SearchIcon } from "lucide-react"
import ProductList from "../components/ProductList"
import { productAPI } from "../utils/api"

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query, page = 1) => {
    if (!query.trim()) return

    try {
      setLoading(true)
      const response = await productAPI.getAll({
        search: query,
        page,
        limit: 12,
      })

      setProducts(response.data.products)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error("Error searching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() })
    }
  }

  const handlePageChange = (page) => {
    const query = searchParams.get("q")
    if (query) {
      performSearch(query, page)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Form */}
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search for furniture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600"
          >
            <SearchIcon size={24} />
          </button>
        </form>
      </div>

      {/* Search Results */}
      {searchParams.get("q") && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Search Results for "{searchParams.get("q")}"</h1>
          {!loading && <p className="text-gray-600">{pagination.total || 0} products found</p>}
        </div>
      )}

      <ProductList
        products={products}
        loading={loading}
        emptyMessage={`No products found for "${searchParams.get("q")}". Try different keywords.`}
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

export default Search

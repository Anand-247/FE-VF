import axios from "axios"

const API_BASE_URL = "http://192.168.31.217:5000/api" || process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken")
      window.location.href = "/admin/login"
    }
    return Promise.reject(error)
  },
)

// API functions
export const categoryAPI = {
  getAll: () => api.get("/categories"),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  deleteImage: (id, imageId) => api.delete(`/products/${id}/images/${imageId}`),
}

export const orderAPI = {
  create: (data) => api.post("/orders", data),
  getAll: (params) => api.get("/orders", { params }),
  getById: (id) => api.get(`/orders/${id}`),
  update: (id, data) => api.put(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}`),
}

export const contactAPI = {
  create: (data) => api.post("/contact", data),
  getAll: (params) => api.get("/contact", { params }),
  reply: (id, data) => api.put(`/contact/${id}/reply`, data),
  updateStatus: (id, data) => api.put(`/contact/${id}/status`, data),
  delete: (id) => api.delete(`/contact/${id}`),
}

export const comboAPI = {
  getAll: () => api.get("/combos"),
  create: (data) => api.post("/combos", data),
  update: (id, data) => api.put(`/combos/${id}`, data),
  delete: (id) => api.delete(`/combos/${id}`),
}

export const bannerAPI = {
  getAll: () => api.get("/banners"),
  create: (data) => api.post("/banners", data),
  update: (id, data) => api.put(`/banners/${id}`, data),
  delete: (id) => api.delete(`/banners/${id}`),
}

export const settingsAPI = {
  getPublic: () => api.get("/settings/public"),
  getAll: () => api.get("/settings"),
  update: (data) => api.put("/settings", data),
}

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
}

export default api

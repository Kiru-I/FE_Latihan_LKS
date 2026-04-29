  import type { Category, CreateProduct, Product } from '~/types/products'
  import type { CheckoutPayload, User, Order, DeleteMsg, OrderStatus } from '~/types/checkout'

  export const useApi = () => {
    const config = useRuntimeConfig()
    const BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000/api'

    const buildUrl = (path: string) => `${BASE_URL}${path}`

    const getHeaders = (isFormData = false) => {
      const headers: Record<string, string> = {}

      // Add JSON content-type
      if (!isFormData) {
        headers['Content-Type'] = 'application/json'
      }

      // Add token from localStorage if available
      const token = localStorage.getItem('token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      return headers
    }

    const createFormData = (data: any): FormData => {
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key])
        }
      })
      return formData
    }

    const request = async <T>(
      path: string,
      options: any = {}
    ): Promise<T> => {
      const isFormData = options.body instanceof FormData

      return await $fetch<T>(buildUrl(path), {
        headers: getHeaders(isFormData),
        ...options
      })
    }

    return {
      products: {
        getAll: () =>
          request('/product'),

        getById: (id: number) =>
          request<Product>(`/product/${id}`),

        getByCategory: (categoryId: number) =>
          request<Product[]>(`/product/category/${categoryId}`),

        search: (query: string) =>
          request<Product[]>(`/product/search?q=${encodeURIComponent(query)}`),

        create: (data: FormData) =>
          request('/product/create', {
          method: 'POST',
          body: data
        }),

        createWithImage: (data: Partial<Product>) =>
          request<Product>('/product/create', {
          method: 'POST',
          body: createFormData(data)
        }),

        update: (id: number, data: FormData) =>
          request(`/product/${id}`, {
          method: 'PATCH',
          body: data
        }),

        delete: (id: number) =>
          request<void>(`/product/delete/${id}`, {
          method: 'DELETE'
        })
      },

      category:{
        getAll: () =>
          request<Category[]>(`/category`),

        getById: (id: number) =>
          request<Category>(`/category/${id}`),

        create: (data: Partial<Category>) =>
          request<Category>('/category/create', {
            method: 'POST',
            body: data
        }),

        update: (id: number, data: Partial<Category>) =>
          request<Category>(`/category/${id}`, {
          method: 'PATCH',
          body: data
        }),

        delete: (id: number) =>
          request(`/category/${id}`, {
          method: 'PATCH',
          body: { isDeleted: true }
        })            
      },

      auth: {
        login: (data: { email: string; password: string }) =>
          request<{ token: string }>('/user/login', {
          method: 'POST',
          body: data
        }),

        register: (data: { name: string; email: string; password: string }) =>
          request('/user/register', {
          method: 'POST',
          body: data
        }),

        getMe: () =>
          request('/user', {
          method: 'GET'
        })
      },

      cart: {
        getCart: () =>
          request('/cart'),

        getItem: (productId: number) =>
          request(`/cart/${productId}`),

        add: (data: { productId: number; quantity?: number }) =>
          request('/cart', {
          method: 'POST',
          body: data
        }),

        updateQuantity: (productId: number, quantity: number) =>
          request(`/cart/${productId}`, {
          method: 'PUT',
          body: { quantity }
        }),

        increase: (productId: number) =>
          request(`/cart/${productId}/increase`, {
          method: 'PATCH'
        }),

        decrease: (productId: number) =>
          request(`/cart/${productId}/decrease`, {
          method: 'PATCH'
        }),

        remove: (productId: number) =>
          request(`/cart/${productId}`, {
          method: 'DELETE'
        }),

        clear: () =>
          request('/cart', {
          method: 'DELETE'
        })
      },

      order: {
        checkout: (data: CheckoutPayload) =>
          request<CheckoutPayload>('/order/checkout', {
          method: 'POST',
          body: data
        }),

        getAll: () =>
          request<Order[]>(`/order`, {
          method: 'GET'
        }),
          getById: (id: number) =>
          request(`/order/${id}`, {
          method: 'GET'
        }),
        getByUserId: () =>
          request<Order[]>(`/order/user`, {
          method: 'GET'
        }),
        getByStatus: (status: OrderStatus) =>
          request<Order[]>('/order/status', {
            method: 'GET',
            query: {eq: status}
        }),
        updateStatus: (id: number, status: OrderStatus) =>
          request(`/order/status/${id}`, {
            method: 'PATCH',
            body: { status }
        }),
        delete: (id: number) =>
          request<DeleteMsg>(`/order/${id}`, {
            method: 'DELETE'
        })
      }
    }
  }
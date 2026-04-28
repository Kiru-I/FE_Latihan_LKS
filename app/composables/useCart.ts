import { useToast } from "vue-toastification"
export const useCart = () => {
  const api = useApi()
  const toast = useToast()

  const loading = ref(false)

  const addToCart = async (productId: number) => {
    if (loading.value) return

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login first')
      return
    }

    loading.value = true

    try {
      const res = await api.cart.add({ productId }) as { message?: string }

      toast.success(res.message || 'Added to cart')
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to add to cart')
    } finally {
      loading.value = false
    }
  }

  return { addToCart, loading }
}
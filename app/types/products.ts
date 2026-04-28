export interface Category{
    id: number
    name: string
}

export interface Product{
  id: number
  name: string
  price: string
  imageUrl: string
  categoryId: number
  categoryName: string
  stock?: number
  description?: string
}

export interface CreateProduct{
  name: string
  price: string
  categoryId: number
  stock?: number
  description?: string
}
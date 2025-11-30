import { httpGet, type ApiListResponse } from './http.service'

type ApiProduct = {
  id: number
  name: string
  price?: number | null
  quantity?: number | null
  category_id?: number | null
  area_id?: number | null
  status?: boolean | null
}

export type ProductRow = {
  id: number
  name: string
  price: string
  quantity: string
  category: string
  area: string
  status: string
}

type ProductsResponse = ApiListResponse<{
  products?: ApiProduct[]
}>

const FALLBACK_PRODUCTS: ProductRow[] = [
  { id: 1, name: 'Producto 1', price: '$100.00', quantity: '50', category: 'Categoría #1', area: 'Área #1', status: 'Activo' },
  { id: 2, name: 'Producto 2', price: '$200.00', quantity: '30', category: 'Categoría #2', area: 'Área #2', status: 'Activo' },
]

const normalizeProducts = (products: ApiProduct[] = []): ProductRow[] =>
  products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price ? `$${product.price.toFixed(2)}` : '$0.00',
    quantity: product.quantity?.toString() ?? '0',
    category: product.category_id ? `Categoría #${product.category_id}` : 'Sin categoría',
    area: product.area_id ? `Área #${product.area_id}` : 'Sin área',
    status: product.status === false ? 'Inactivo' : 'Activo',
  }))

export const listProducts = async (): Promise<ProductRow[]> => {
  try {
    const response = await httpGet<ProductsResponse>('/products')
    const products = response.data?.products
    if (!products || products.length === 0) {
      return FALLBACK_PRODUCTS
    }
    return normalizeProducts(products)
  } catch (error) {
    console.warn('listProducts fallback:', error)
    return FALLBACK_PRODUCTS
  }
}
import { httpGet, type ApiListResponse } from './http.service'

type ApiArea = {
  id: number
  name: string
  warehouse_id?: number | null
  status?: boolean | null
}

export type AreaRow = {
  id: number
  name: string
  warehouse: string
  status: string
}

type AreasResponse = ApiListResponse<{
  areas?: ApiArea[]
}>

const FALLBACK_AREAS: AreaRow[] = [
  { id: 1, name: 'Área 1', warehouse: 'Almacén #1', status: 'Activo' },
  { id: 2, name: 'Área 2', warehouse: 'Almacén #2', status: 'Activo' },
]

const normalizeAreas = (areas: ApiArea[] = []): AreaRow[] =>
  areas.map((area) => ({
    id: area.id,
    name: area.name,
    warehouse: area.warehouse_id ? `Almacén #${area.warehouse_id}` : 'Sin almacén',
    status: area.status === false ? 'Inactivo' : 'Activo',
  }))

export const listAreas = async (): Promise<AreaRow[]> => {
  try {
    const response = await httpGet<AreasResponse>('/areas')
    const areas = response.data?.areas
    if (!areas || areas.length === 0) {
      return FALLBACK_AREAS
    }
    return normalizeAreas(areas)
  } catch (error) {
    console.warn('listAreas fallback:', error)
    return FALLBACK_AREAS
  }
}
import { httpGet, type ApiListResponse } from './http.service'

type ApiArea = {
  id: number
  name: string
  warehouse_id: number 
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

const FALLBACK_AREAS: AreaRow[] = []

const normalizeAreas = (areas: ApiArea[] = []): AreaRow[] =>
  areas.map((area) => ({
    id: area.id,
    name: area.name,
    warehouse: `Almacén #${area.warehouse_id}`,
    status: area.status === false ? 'Inactivo' : 'Activo',
  }))

export const listAreas = async (): Promise<AreaRow[]> => {
  try {
    const response = await httpGet<AreasResponse>('/areas')
    const areas = response.data?.areas 
    if (!areas || areas.length === 0) return FALLBACK_AREAS
    return normalizeAreas(areas)
  } catch (error) {
    console.warn('Error Areas:', error)
    return FALLBACK_AREAS
  }
}
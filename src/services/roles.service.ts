import { httpGet, type ApiListResponse } from './http.service'

type ApiRole = {
  id: number
  name: string
  status?: boolean | null
}

export type RoleRow = {
  id: number
  name: string
  status: string
}

type RolesResponse = ApiListResponse<{
  roles?: ApiRole[]
}>

const FALLBACK_ROLES: RoleRow[] = [
  { id: 1, name: 'Admin', status: 'Activo' },
  { id: 2, name: 'Usuario', status: 'Activo' },
]

const normalizeRoles = (roles: ApiRole[] = []): RoleRow[] =>
  roles.map((role) => ({
    id: role.id,
    name: role.name,
    status: role.status === false ? 'Inactivo' : 'Activo',
  }))

export const listRoles = async (): Promise<RoleRow[]> => {
  try {
    const response = await httpGet<RolesResponse>('/roles')
    const roles = response.data?.roles
    if (!roles || roles.length === 0) {
      return FALLBACK_ROLES
    }
    return normalizeRoles(roles)
  } catch (error) {
    console.warn('listRoles fallback:', error)
    return FALLBACK_ROLES
  }
}
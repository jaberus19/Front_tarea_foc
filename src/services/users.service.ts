import { httpGet, type ApiListResponse } from './http.service'

type ApiUser = {
  id: number
  name: string | null
  email: string
  role_id?: number | null
  status?: boolean | null
}

export type UserRow = {
  id: number
  name: string
  email: string
  role: string
  status: string
}

type UsersResponse = ApiListResponse<{
  users?: ApiUser[]
}>

const FALLBACK_USERS: UserRow[] = [
  { id: 1, name: 'Usuario 1', email: 'usuario1@example.com', role: 'Rol #1', status: 'Activo' },
  { id: 2, name: 'Usuario 2', email: 'usuario2@example.com', role: 'Rol #2', status: 'Activo' },
]

const normalizeUsers = (users: ApiUser[] = []): UserRow[] =>
  users.map((user) => ({
    id: user.id,
    name: user.name ?? 'Sin nombre',
    email: user.email,
    role: user.role_id ? `Rol #${user.role_id}` : 'Sin rol',
    status: user.status === false ? 'Inactivo' : 'Activo',
  }))

export const listUsers = async (): Promise<UserRow[]> => {
  try {
    const response = await httpGet<UsersResponse>('/users')
    const users = response.data?.users
    if (!users || users.length === 0) {
      return FALLBACK_USERS
    }
    return normalizeUsers(users)
  } catch (error) {
    console.warn('listUsers fallback:', error)
    return FALLBACK_USERS
  }
}
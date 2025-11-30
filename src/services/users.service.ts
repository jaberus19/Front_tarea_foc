import { httpGet, type ApiListResponse } from './http.service'

type ApiUser = {
  id: number
  name: string | null
  email: string
  role_id: number 
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

const FALLBACK_USERS: UserRow[] = []

const normalizeUsers = (users: ApiUser[] = []): UserRow[] =>
  users.map((user) => ({
    id: user.id,
    name: user.name ?? 'Sin nombre',
    email: user.email,
    role: `Rol #${user.role_id}`,
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
    console.warn('Error Users:', error)
    return FALLBACK_USERS
  }
}
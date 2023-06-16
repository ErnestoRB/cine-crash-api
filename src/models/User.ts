export interface User {
  username: string
  name: string
  lastname: string
  email: string
  password: string
}

export interface UserDetails {
  provider: string | null
  email: string | null
  name: string | null
  number: string | null
}

export interface IUSer {
  id: string
  name: string
  email: string
  password: string
  profile: string | null
  created_at: Date
  updated_at?: Date
}

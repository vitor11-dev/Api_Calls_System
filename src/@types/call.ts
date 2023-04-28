export interface ICall {
  id: string
  client: string
  subject: string
  status: 'Aberto' | 'Finalizado'
  created_at: Date
  user_id: string
}

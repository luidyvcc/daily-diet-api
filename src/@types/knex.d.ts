// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    user: {
      id: string
      name: string
      email: string
      avatarURL?: string
      created_at?: Date
    },
    meal: {
      id: string
      user_id: string
      name: string
      description: string
      date: Date
      is_diet: boolean
    }
  }
}

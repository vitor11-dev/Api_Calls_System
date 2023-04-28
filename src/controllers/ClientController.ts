import { Request, Response } from 'express'
import { prisma } from '../database/prismaClient'

export class ClientController {
  async create(req: Request, res: Response) {
    if (req.method !== 'POST') return res.status(400).end()

    try {
      const { user_id, name, email, address } = req.body

      const client = await prisma.client.create({
        data: {
          user: {
            connect: {
              id: user_id,
            },
          },
          name,
          email,
          address,
        },
      })

      const { created_at, updated_at, user_id: _, ...clientData } = client

      return res.json(clientData)
    } catch (error) {
      return res.status(400).json(error).end()
    }
  }

  async getClients(req: Request, res: Response) {
    if (req.method !== 'GET') return res.status(400).end()

    try {
      const { id } = req.params

      const userExists = await prisma.user.findFirst({
        where: {
          id,
        },
      })

      if (!userExists) {
        return res.status(400).json({ error: 'user not found' })
      }

      const clients = await prisma.client.findMany({
        select: {
          name: true,
          email: true,
          address: true,
        },
        where: {
          user_id: id,
        },
      })

      return res.json(clients)
    } catch (error) {
      return res.status(400).end()
    }
  }
}

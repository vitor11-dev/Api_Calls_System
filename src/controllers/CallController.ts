import { Request, Response } from 'express'
import { ICall } from '../@types/call'
import { prisma } from '../database/prismaClient'

export class CallController {
  async create(req: Request, res: Response) {
    if (req.method !== 'POST') return res.status(400).end()

    try {
      const { user_id, client, subject, status } = req.body as ICall

      const call = await prisma.call.create({
        data: {
          user: {
            connect: {
              id: user_id,
            },
          },
          client,
          status,
          subject,
        },
      })

      const { updated_at, user_id: _, ...callData } = call

      return res.json(callData)
    } catch (error) {
      return res.status(400).end()
    }
  }

  async update(req: Request, res: Response) {
    if (req.method !== 'PUT') return res.status(400).end()

    try {
      const { id } = req.params as Partial<ICall>

      const callExists = await prisma.call.findUnique({
        where: {
          id,
        },
      })

      if (!callExists)
        return res.status(400).json({ error: 'call not exists' }).end()

      const statusUpdate = await prisma.call.update({
        where: {
          id,
        },
        data: {
          status: 'Finalizado',
        },
      })

      return res.json({ message: 'status updated successfully' })
    } catch (error) {
      return res.status(400).end()
    }
  }

  async getCalls(req: Request, res: Response) {
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

      const calls = await prisma.call.findMany({
        select: {
          client: true,
          subject: true,
          status: true,
          created_at: true,
        },
        where: {
          user_id: id,
        },
      })

      return res.json(calls)
    } catch (error) {
      return res.status(400).end()
    }
  }
}

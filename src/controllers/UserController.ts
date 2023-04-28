import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { IUser } from '../@types/user'
import { prisma } from '../database/prismaClient'

export class UserController {
  async create(req: Request, res: Response) {
    try {
      if (req.method !== 'POST') return res.status(400).end()

      const { name, email, password } = req.body as IUser

      const userExists = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (userExists) {
        return res
          .status(400)
          .json({ error: 'email has already been registered' })
      }

      const hashPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
        },
      })

      const { password: _, created_at, updated_at, ...userData } = newUser

      return res.status(201).json(userData)
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (req.method !== 'PUT') return res.status(400).end()

      const { email } = req.params
      const { password } = req.body as IUser

      const hashPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.update({
        where: {
          email,
        },
        data: {
          password: hashPassword,
        },
      })

      if (user) {
        const { password: _, created_at, updated_at, ...userData } = user

        return res.json(userData)
      }

      return res.json(null)
    } catch (error) {
      return res.status(400).end()
    }
  }

  async delete(req: Request, res: Response) {
    if (req.method !== 'DELETE') return res.status(400).end()

    try {
      const { email } = req.params

      await prisma.user.delete({
        where: {
          email,
        },
      })

      return res.json({
        message: 'successfully deleted user',
      })
    } catch (error) {
      return res.status(400).json(error).end()
    }
  }
}

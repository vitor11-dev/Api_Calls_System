import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { prisma } from '../database/prismaClient'
import { IUSer } from '../types/UserData'

export class UserController {
  async create(request: Request, response: Response) {
    try {
      const { name, email, password, profile } = request.body as IUSer

      const userExists = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (userExists) {
        return response
          .status(400)
          .json({ message: 'email has already been registered' })
      }

      const hashPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          profile,
        },
      })

      const { password: _, ...userData } = newUser

      return response.status(201).json(userData)
    } catch (error) {
      return response.status(400).json(error)
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { lastEmail } = request.params
      const { name, email, password, profile } = request.body as IUSer

      const hashPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.update({
        where: {
          email: lastEmail,
        },
        data: {
          name,
          email,
          password: hashPassword,
          profile,
        },
      })

      if (user) {
        const { password: _, ...userData } = user

        return response.json(userData)
      }

      return response.json(null)
    } catch (error) {
      return response.status(400).end()
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { email } = request.params

      await prisma.user.delete({
        where: {
          email,
        },
      })

      return response.json({
        message: 'successfully deleted user',
      })
    } catch (error) {
      return response.status(400).end()
    }
  }
}

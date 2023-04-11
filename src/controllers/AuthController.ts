import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../database/prismaClient'
import { IUSer } from '../types/UserData'

export class AuthController {
  async SignIn(request: Request, response: Response) {
    try {
      const { email, password } = request.body as Partial<IUSer>

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user)
        return response
          .status(400)
          .json({ message: 'invalid email or password' })

      const verifyPass = await bcrypt.compare(password!, user?.password)

      if (!verifyPass)
        return response
          .status(400)
          .json({ message: 'invalid email or password' })

      const token = jwt.sign(
        {
          email: user.email,
        },

        process.env.JWT_PASS!!,

        {
          expiresIn: '8h',
        }
      )

      const { password: _, ...userData } = user

      return response.json({
        user: userData,
        token,
      })
    } catch (error) {
      return response.status(400).end()
    }
  }
}

import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { IUser } from '../@types/user'
import { prisma } from '../database/prismaClient'

export class AuthController {
  async SignIn(req: Request, res: Response) {
    try {
      if (req.method !== 'POST') return res.status(400).end()

      const { email, password } = req.body as Partial<IUser>

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user)
        return res.status(400).json({ error: 'invalid email or password' })

      const verifyPass = await bcrypt.compare(password!, user?.password)

      if (!verifyPass)
        return res.status(400).json({ error: 'invalid email or password' })

      const token = jwt.sign(
        {
          id: user.id,
        },

        process.env.JWT_PASS!!,

        {
          expiresIn: '8h',
        }
      )

      const { password: _, created_at, updated_at, ...userData } = user

      return res.json({
        user: userData,
        token,
      })
    } catch (error) {
      return res.status(400).end()
    }
  }
}

import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  id: string
  iat: number
  exp: number
}

export function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers
  if (!authorization)
    return res.status(401).json({ error: 'Token not provided' })

  const [, token] = authorization.split(' ')

  try {
    const decoded = jwt.verify(token, process.env.JWT_PASS!)
    const { id } = decoded as TokenPayload

    req.userId = id
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}

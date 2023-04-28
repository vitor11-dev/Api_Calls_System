import cors from 'cors'
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import router from './http/routes'

const port = process.env.PORT as number | undefined

const app = express()

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'X-PINGOTHER, Content-Type, Authorization'
  )
  app.use(cors())
  next()
})

app.use(express.json())
app.use(router)

app.listen(port, () => console.log('Server is running in port ' + port))

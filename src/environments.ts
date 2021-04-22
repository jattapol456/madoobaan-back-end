import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({
  path:
    process.env.NODE_ENV == 'production'
      ? path.resolve(process.cwd(), '.env.production')
      : path.resolve(process.cwd(), '.env.development'),
})

import { Pool } from 'pg'
import env from './env'

export default new Pool({
    'host': env.get('DB_HOST'),
    'database': env.get('DB_NAME'),
    'user': env.get('DB_USER'),
    'password': env.get('DB_PASSWORD')
})

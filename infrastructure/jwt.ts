import Visign from 'visign/Visign'
import env from './env'

export default new Visign(env.get('JWT_SECRET'))
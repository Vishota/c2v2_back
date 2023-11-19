import { Handler } from 'express'
import { checkKeys } from '../misc/api'
import { logIn, signUp } from '../logics/auth'
import env from '../infrastructure/env'

export default {
    '/auth': async (req, res) => {
        const request = checkKeys(req.query as any, ['username', 'password'], ['signup'])
        if ('signup' in request) {
            const signedUp = await signUp(request.username, request.password)
            if (!signedUp) {
                res.send({ success: false });
                return
            }
            res.cookie('access', signedUp.tokens.access, {
                maxAge: parseInt(env.get('ACCESS_ALIVE_MS')),
                httpOnly: true
            });
            res.cookie('refresh', signedUp.tokens.refresh, {
                maxAge: parseInt(env.get('REFRESH_ALIVE_MS')),
                httpOnly: true
            });
            res.send({ success: true, id: signedUp.id })
        }
        else {
            const loggedIn = await logIn(request.username, request.password)
            if (!loggedIn) {
                res.send({ success: false });
                return
            }
            res.cookie('access', loggedIn.tokens.access, {
                maxAge: parseInt(env.get('ACCESS_ALIVE_MS')),
                httpOnly: true
            });
            res.cookie('refresh', loggedIn.tokens.refresh, {
                maxAge: parseInt(env.get('REFRESH_ALIVE_MS')),
                httpOnly: true
            });
            res.send({ success: true, id: loggedIn.id })
        }
    }
} as { [url: string]: Handler }
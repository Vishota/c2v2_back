import { Handler } from 'express'
import { checkKeys } from '../misc/api'
import { logIn, signUp } from '../logics/auth'
import { checkAdmin, checkTeacher, setAuthCookie } from '../misc/auth'
import { getUsername } from '../data/accounts'

export default {
    '/auth': async (req, res) => {
        const request = checkKeys(req.query as any, ['username', 'password'], ['signup'])
        if ('signup' in request) {
            const signedUp = await signUp(request.username, request.password)
            if (!signedUp) {
                res.send({ success: false });
                return
            }
            setAuthCookie(res, signedUp)
            res.send({ success: true, id: signedUp.id })
        }
        else {
            const loggedIn = await logIn(request.username, request.password)
            if (!loggedIn) {
                res.send({ success: false });
                return
            }
            setAuthCookie(res, loggedIn)
            res.send({ success: true, id: loggedIn.id })
        }
    },
    '/auth/me': async (req, res, next) => {
        const admin = await checkAdmin(req, res, next);
        const teacher = await checkTeacher(req, res, next);
        res.send({
            id: admin.id,
            isAdmin: admin.isAdmin !== false,
            isPrimeAdmin: admin.isAdmin ? admin.isAdmin.prime : false,
            isTeacher: teacher.teacher,
            isActiveTeacher: teacher.active === true,
            isInactiveTeacher: teacher.active === false,
            username: admin?.id ? await getUsername(admin.id) : undefined
        })
    }
} as { [url: string]: Handler }
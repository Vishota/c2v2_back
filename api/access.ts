import { Handler } from "express";
import { checkKeys } from "../misc/api";
import { checkAdmin, getAuth } from "../misc/auth";
import { checkAccess, giveAccess, removeAccess } from "../data/accountCourseAccess";

export default {
    '/courseAccess/give': async (req, res, next) => {
        const request = checkKeys(req.body as any, ['account', 'course'])
        const admin = await checkAdmin(req, res, next)
        if (!admin.id) throw 'no_auth'
        res.send({ success: await giveAccess(parseInt(request.account), parseInt(request.course), admin.isAdmin ? 'ADMIN' : admin.id) })
    },
    '/courseAccess/remove': async (req, res, next) => {
        const request = checkKeys(req.body as any, ['account', 'course'])
        const admin = await checkAdmin(req, res, next)
        if (!admin.id) throw 'no_auth'
        res.send({ success: await removeAccess(parseInt(request.account), parseInt(request.course), admin.isAdmin ? 'ADMIN' : admin.id) })
    },
    '/courseAccess/check': async (req, res, next) => {
        const request = checkKeys(req.body as any, ['course'])
        const me = await getAuth(req, res, next);
        if (!me) {
            res.send({ access: false })
            return;
        }
        res.send({ access: await checkAccess(me, request.course) })
    }
} as { [url: string]: Handler }

import { Handler } from "express";
import { checkKeys } from "../misc/api";
import { checkAdmin } from "../misc/auth";
import { giveAccess, removeAccess } from "../data/accountCourseAccess";

export default {
    '/courseAccess/give': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['account', 'course'])
        const admin = await checkAdmin(req, res, next)
        if (!admin.id) throw 'no_auth'
        res.send({ success: await giveAccess(parseInt(request.account), parseInt(request.course), admin.isAdmin ? 'ADMIN' : admin.id) })
    },
    '/courseAccess/remove': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['account', 'course'])
        const admin = await checkAdmin(req, res, next)
        if (!admin.id) throw 'no_auth'
        res.send({ success: await removeAccess(parseInt(request.account), parseInt(request.course), admin.isAdmin ? 'ADMIN' : admin.id) })
    }
} as { [url: string]: Handler }

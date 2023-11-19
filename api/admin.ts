import { Handler } from "express";
import { checkKeys } from "../misc/api";
import { checkAdmin } from "../misc/auth";
import { setUserAccess } from "../data/accounts";

export default {
    '/admin/ban': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['id']);
        const admin = await checkAdmin(req, res, next)
        if (!admin.isAdmin) {
            res.send({ success: false, info: 'not_admin' });
            return
        }
        res.send({
            success: await setUserAccess(parseInt(request.id), false, admin.isAdmin.prime)
        })
    },
    '/admin/unban': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['id']);
        const admin = await checkAdmin(req, res, next)
        if (!admin.isAdmin) {
            res.send({ success: false, info: 'not_admin' });
            return
        }
        res.send({
            success: await setUserAccess(parseInt(request.id), true, admin.isAdmin.prime)
        })
    }
} as { [url: string]: Handler }
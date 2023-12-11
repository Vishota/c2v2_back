import { Handler } from "express";
import { checkKeys } from "../misc/api";
import { checkAdmin } from "../misc/auth";
import { setUserAccess } from "../data/accounts";
import { getInactiveList, setTeacherActive } from "../data/teachers";

export default {
    '/admin/ban': async (req, res, next) => {
        const request = checkKeys(req.body as any, ['id']);
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
        const request = checkKeys(req.body as any, ['id']);
        const admin = await checkAdmin(req, res, next)
        if (!admin.isAdmin) {
            res.send({ success: false, info: 'not_admin' });
            return
        }
        res.send({
            success: await setUserAccess(parseInt(request.id), true, admin.isAdmin.prime)
        })
    },
    '/admin/setTeacherActive': async (req, res, next) => {
        const request = checkKeys(req.body as any, ['id'], ['active', 'inactive'])
        const admin = await checkAdmin(req, res, next)
        if (!admin.isAdmin) {
            res.send({ success: false, info: 'not_admin' });
            return false;
        }
        // 'inactive' passed in query => set inactive, else active
        res.send({ success: await setTeacherActive(parseInt(request.id), !('inactive' in request)) })
    },
    '/admin/listInactive': async (req, res, next) => {
        const admin = await checkAdmin(req, res, next)
        if (!admin.isAdmin) {
            res.send({ success: false, info: 'not_admin' });
            return false;
        }
        res.send({ teachers: await getInactiveList() })
    }
} as { [url: string]: Handler }
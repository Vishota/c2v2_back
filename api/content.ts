import { Handler } from "express";
import { checkAdmin, checkTeacher } from "../misc/auth";
import { addContent, getContent, setContentAccessible } from "../data/content";
import { checkKeys } from "../misc/api";

export default {
    '/content/add': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['title', 'content'])
        const teacher = await checkTeacher(req, res, next)
        if (!(teacher.teacher && teacher.active) || !teacher.id) {
            throw 'not_a_teacher'
        }
        res.send({ id: await addContent(teacher.id, request.title, request.content) })
    },
    '/content/get': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['id'])
        const admin = await checkAdmin(req, res, next)
        res.send(await getContent(parseInt(request.id), admin.isAdmin != false, admin.id))
    },
    '/content/show': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['id'])
        const admin = await checkAdmin(req, res, next);
        const as = admin.isAdmin ? 'ADMIN' : admin.id
        if (!as) throw 'no_id'
        res.send({ success: await setContentAccessible(parseInt(request.id), true, as) })
    },
    '/content/hide': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['id'])
        const admin = await checkAdmin(req, res, next);
        const as = admin.isAdmin ? 'ADMIN' : admin.id
        if (!as) throw 'no_id'
        res.send({ success: await setContentAccessible(parseInt(request.id), false, as) })
    }
} as { [url: string]: Handler }
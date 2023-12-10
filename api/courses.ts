import { Handler } from "express";
import { checkKeys } from "../misc/api";
import { addCourse, getCourse, setCourseAccessible } from "../data/courses";
import { checkAdmin, checkTeacher } from "../misc/auth";
import { setContentAccessible } from "../data/content";

export default {
    '/courses/new': async (req, res, next) => {
        const request = checkKeys(JSON.parse(req.body) as any, ['title', 'about', 'price'])
        const teacher = await checkTeacher(req, res, next)
        if (!teacher.id) throw 'not_a_teacher'
        res.send({ id: await addCourse(teacher.id, request.title, request.about, parseInt(request.price)) })
    },
    '/courses/show': async (req, res, next) => {
        const request = checkKeys(JSON.parse(req.body) as any, ['id'])
        const admin = await checkAdmin(req, res, next)
        if (!admin.id) throw 'no_auth'
        res.send({ success: await setCourseAccessible(parseInt(request.id), true, admin.isAdmin ? 'ADMIN' : admin.id) });
    },
    '/courses/hide': async (req, res, next) => {
        const request = checkKeys(JSON.parse(req.body) as any, ['id'])
        const admin = await checkAdmin(req, res, next)
        if (!admin.id) throw 'no_auth'
        res.send({ success: await setCourseAccessible(parseInt(request.id), false, admin.isAdmin ? 'ADMIN' : admin.id) });
    },
    '/courses/get': async (req, res, next) => {
        const request = checkKeys(JSON.parse(req.body) as any, ['id'])
        const admin = await checkAdmin(req, res, next)
        res.send({course: await getCourse(parseInt(request.id), admin.isAdmin ? 'ADMIN' : admin.id ? admin.id : null)})
    }
} as { [url: string]: Handler }
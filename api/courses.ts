import { Handler } from "express";
import { checkKeys } from "../misc/api";
import { addCourse } from "../data/courses";
import { checkTeacher } from "../misc/auth";

export default {
    '/courses/new': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['title', 'about'])
        const teacher = await checkTeacher(req, res, next)
        if (!teacher.id) throw 'not_a_teacher'
        res.send({ id: await addCourse(teacher.id, request.title, request.about) })
    }
} as { [url: string]: Handler }
import { Handler } from "express";
import { checkTeacher } from "../misc/auth";
import { addContent } from "../data/content";
import { checkKeys } from "../misc/api";

export default {
    '/content/add': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['title', 'content'])
        const teacher = await checkTeacher(req, res, next)
        if(!(teacher.teacher && teacher.active) || !teacher.id) {
            throw 'not_a_teacher'
        }
        res.send({ id: await addContent(teacher.id, request.title, request.content) })
    }
} as { [url: string]: Handler }
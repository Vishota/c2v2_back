import { Handler } from "express";
import { checkKeys } from "../misc/api";
import { addTeacher, getTeacherInfo } from "../data/teachers";
import { getAuth } from "../misc/auth";

export default {
    '/teachers/addSelf': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['name', 'speciality', 'about'])
        const me = await getAuth(req, res, next)
        if (!me) {
            res.send({ success: false })
            return
        }
        res.send({ success: await addTeacher(me, request) })
    },
    '/teachers/info': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['id'])
        res.send({ info: await getTeacherInfo(parseInt(request.id)) })
    }
} as { [url: string]: Handler }

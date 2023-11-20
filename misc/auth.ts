import { Handler } from 'express'
import { checkTokens } from '../logics/auth'
import { Response } from 'express'
import env from '../infrastructure/env'
import { isAdmin } from '../data/admins'
import { getTeacherInfo } from '../data/teachers'

export async function getAuth(...[req, res]: Parameters<Handler>): Promise<number | false> {
    if (!(req.cookies.access && req.cookies.refresh)) {
        return false
    }
    const [id, refresh] = req.cookies.refresh.split('>')
    const auth = await checkTokens(parseInt(id), req.cookies.access, refresh);
    if (!auth) return false;
    if (auth.tokens) {
        setAuthCookie(res, auth)
    }
    return auth ? auth.id : false
}
export async function checkAdmin(...[req, res, next]: Parameters<Handler>): Promise<{
    id?: number; isAdmin: false | {
        admin: true
        prime: boolean
    }
}> {
    const id = await getAuth(req, res, next);
    if (!id) return { isAdmin: false };
    return {
        id,
        isAdmin: await isAdmin(id)
    }
}
export async function checkTeacher(...[req, res, next]: Parameters<Handler>): Promise<{
    id?: number,
    teacher: boolean,
    active?: boolean
}> {
    const id = await getAuth(req, res, next);
    if (!id) return { teacher: false };
    const teacherInfo = await getTeacherInfo(id)
    return {
        id,
        teacher: teacherInfo ? true : false,
        active: teacherInfo.is_active
    }
}

export function setAuthCookie(res: Response, info: { id: number, tokens?: { access?: string, refresh?: string } }) {
    if (info.tokens?.access) {
        res.cookie('access', info.tokens.access, {
            maxAge: parseInt(env.get('ACCESS_ALIVE_MS')),
            httpOnly: true
        });

    }
    if (info.tokens?.refresh) {
        res.cookie('refresh', info.id + '>' + info.tokens.refresh, {
            maxAge: parseInt(env.get('REFRESH_ALIVE_MS')),
            httpOnly: true
        });
    }
}

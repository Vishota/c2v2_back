import { Handler } from 'express'
import { checkKeys } from '../misc/api'
import { checkAdmin } from '../misc/auth';
import { attach, detach } from '../data/courseContentAttachments';

export default {
    '/attachments/attach': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['course', 'content']);
        const admin = await checkAdmin(req, res, next)
        if(!admin.id) throw 'no_auth'
        res.send({success : await attach(parseInt(request.content), parseInt(request.course), admin.isAdmin ? 'ADMIN' : admin.id)})
    },
    '/attachments/detach': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['course', 'content']);
        const admin = await checkAdmin(req, res, next)
        if(!admin.id) throw 'no_auth'
        res.send({success : await detach(parseInt(request.content), parseInt(request.course), admin.isAdmin ? 'ADMIN' : admin.id)})
    }
} as { [url: string]: Handler }
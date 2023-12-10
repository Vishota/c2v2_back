import { Handler } from 'express'
import { checkKeys } from '../misc/api';
import * as courses from '../data/courses';

export default {
    '/search/byprompt': async (req, res) => {
        const request = checkKeys(req.body as any, ['text']);
        const results = await courses.search(request.text);
        res.send({ results })
    },
    '/search/byowner': async (req, res) => {
        const request = checkKeys(req.body as any, ['teacherId']);
        const results = await courses.getOwnedBy(parseInt(request.teacherId));
        res.send({ results });
    },
    '/search/byaccess': async (req, res) => {
        const request = checkKeys(req.body as any, ['accountId']);
        const results = await courses.getAccesedBy(parseInt(request.accountId));
        res.send({ results })
    },
} as { [url: string]: Handler }
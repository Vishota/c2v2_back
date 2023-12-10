import { Handler } from "express";
import { getAuth } from "../misc/auth";
import { getWallet, makeWallet, pay } from "../data/wallets";
import { checkKeys } from "../misc/api";
import { buyCourse, deposit } from "../logics/purchase";

export default {
    '/finances/my': async (req, res, next) => {
        const me = await getAuth(req, res, next)
        if (!me) return;
        res.send({
            wallet: await getWallet(me)
        })
    },
    '/finances/createWallet': async (req, res, next) => {
        const me = await getAuth(req, res, next)
        if (!me) return;
        res.send({
            success: await makeWallet(me)
        })
    },
    '/finances/deposit': async (req, res, next) => {
        const request = checkKeys(req.body as any, ['amount', 'method'])
        const me = await getAuth(req, res, next)
        if (!me) return;
        res.send({
            success: await deposit(me, parseInt(request.amount), request.method)
        })
    },
    '/finances/buyCourse': async (req, res, next) => {
        const request = checkKeys(req.body as any, ['id'])
        const me = await getAuth(req, res, next)
        if (!me) return
        
        res.send({
            success: await buyCourse(me, parseInt(request.id))
        })
    }
} as { [url: string]: Handler }

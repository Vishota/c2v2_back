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
    '/finances/deposit/:method': async (req, res, next) => {
        const request = checkKeys(req.query as any, ['amount'])
        const me = await getAuth(req, res, next)
        if (!me) return;
        res.send({
            success: await deposit(me, parseInt(request.amount), req.params.method)
        })
    },
    '/finances/buy/course:id': async (req, res, next) => {
        const me = await getAuth(req, res, next)
        if (!me) return
        
        res.send({
            success: await buyCourse(me, parseInt(req.params.id))
        })
    }
} as { [url: string]: Handler }

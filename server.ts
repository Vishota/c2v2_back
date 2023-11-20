import auth from "./api/auth";
import express from 'express'
import cookieParser from 'cookie-parser'
import admin from "./api/admin";
import teachers from "./api/teachers";

const app = express()
app.use(cookieParser())

const api = {...auth, ...admin, ...teachers}

Object.entries(api).forEach(([url, handler]) => {
    applyHandler(url, handler)
})
app.listen(80)

function applyHandler(url: string, handler: express.Handler) {
    app.all(url, async (req, res, next) => {
        try {
            await handler(req, res, next)
        } catch (e) {
            console.log(e + ' catched');
            console.log( (e as Error).stack )
            try {
                res.send({ success: false })
            }
            catch { }
        }
    });
}
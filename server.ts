import auth from "./api/auth";
import express from 'express'
import cookieParser from 'cookie-parser'
import admin from "./api/admin";
import teachers from "./api/teachers";
import content from "./api/content";
import courses from "./api/courses";
import attachments from "./api/attachments";
import access from "./api/access";
import finances from "./api/finances";

const app = express()
app.use(cookieParser())

const api = {...auth, ...admin, ...teachers, ...content, ...courses, ...attachments, ...access, ...finances}

Object.entries(api).forEach(([url, handler]) => {
    applyHandler(url, handler)
})

function applyHandler(url: string, handler: express.Handler) {
    app.all(url, async (req, res, next) => {
        try {
            await handler(req, res, next)
        } catch (e) {
            console.warn(e + ' catched');
            console.warn( (e as Error).stack )
            try {
                res.send({ success: false })
            }
            catch { }
        }
    });
}

const port = 80
app.listen(port)
console.warn(`API is running at ${port} port`);

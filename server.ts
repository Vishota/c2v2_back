import auth from "./api/auth";
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cookieParser())

Object.entries(auth).forEach(([url, handler]) => {
    applyHandler(url, handler)
})
app.listen(80)

function applyHandler(url:string, handler:express.Handler) {
    app.all(url, async (req,res,next)=>{
        try {
            await handler(req,res,next)
        } catch (e) {
            console.log(e + ' catched');
            console.trace();
        }
    });
}
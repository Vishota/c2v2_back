import auth from "./api/auth";
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cookieParser())

Object.entries(auth).forEach(([url, handler]) => {
    app.all(url, handler);
})
app.listen(80)
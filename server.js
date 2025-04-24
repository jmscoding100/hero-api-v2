const express = require('express')
const server = express()
const router =require('./app/routes/router')
const helmet = require('helmet')
const cors = require('cors')
const PORT = process.env.PORT || 3000


//Handle security
server.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    directives: {
        "img-src": ["'self'", "https: data"],
        "scriptScr": ["'self'", "cdn.jsdelivr.net"]
    }
}))

server.use(cors()).use(express.json()).use(express.urlencoded({
    extended: true
}))


//localhost:3000 => router.js
server.use('/', router)
server.set('view engine', 'ejs')

server.listen(PORT, ()=> console.log(`It works ${PORT}`))
import express from 'express'
import http from 'http'
import serverConnection from './src/config/serverConnection.js'
import expressConfig from './src/middlewares/expressConfig.js'
import router from './src/routes/index.js'
import {connectDB} from './src/config/dbConnection.js'

const app = express()
const server = new http.createServer(app)

expressConfig(app)

app.use(router)


connectDB()
serverConnection(server)
import express from 'express'
import http from 'http'
import serverConnection from './src/config/serverConnection.js'
import expressConfig from './src/middlewares/expressConfig.js'
import router from './src/routes/index.js'
import {connectDB} from './src/config/dbConnection.js'

// Creating the app
const app = express()
// Creating the server
const server = new http.createServer(app)

// Express middlewares config
expressConfig(app)

// Route middlewares
app.use(router)

// Connecting the database
connectDB()

// Connecting the server
serverConnection(server)
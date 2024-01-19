import express from 'express'
import cors from 'cors'

const expressConfig = (app)=>{
    // Enabling CORS
    const enableCors = {
        origin: '*',
        exposeHeaders: ['Cross-Origin-Opener-Policy', 'Cross-Origin-Resource-Policy']
    }
    app.use(cors(enableCors))
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
}

export default expressConfig
import pkg from "pg"
const {Client} = pkg

import configkeys from "./configKeys.js"

const client = new Client({
    // user: 'sterinpaul',
    // password: configkeys.SQL_DB_PASSWORD,
    host: 'localhost',
    database: configkeys.SQL_DB_NAME,
    port:configkeys.SQL_DB_PORT
})

export const connectDB = ()=>{
    try{
        client.connect(() => {
            console.log('Database connected')
        })
    }catch(error){
        console.log('Error connecting database ',error)
    }
}

// client.on('connect',()=>{
//     console.log('DB connected');
// })

client.on('end',()=>{
    console.log('Connection end');
})

export default client
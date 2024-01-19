import dotEnv from 'dotenv'
dotEnv.config()

const configkeys = {
    PORT:process.env.PORT,
    SQL_DB_NAME:process.env.SQL_DB_NAME,
    SQL_DB_PORT:process.env.SQL_DB_PORT
}

export default configkeys
import pkg from "pg"
const { Client } = pkg

import configkeys from "./configKeys.js"

const client = new Client({
    host: 'localhost',
    database: 'postgres',
    port: configkeys.SQL_DB_PORT
})


const createTables = async () => {
    try {
        // Check if header_table exists
        const headerTableCheckQuery = `SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE  table_schema = 'public'
            AND table_name = 'header_table');
        `;
        const headerTableCheck = await client.query(headerTableCheckQuery);
        if (!headerTableCheck.rows[0].exists) {
            // If header_table does not exist, create it
            const createHeaderTableQuery = `
            CREATE TABLE public.header_table (
                vr_no NUMERIC(18) PRIMARY KEY,
                vr_date DATE,
                status CHAR(1),
                ac_name VARCHAR(200),
                ac_amt NUMERIC(18,2)
            );`;

            const createDetailTableQuery = `
            CREATE TABLE public.detail_table (
                vr_no NUMERIC(18) REFERENCES public.header_table(vr_no),
                sr_no SERIAL,
                item_code VARCHAR(20),
                item_name VARCHAR(200),
                description VARCHAR(3000),
                qty NUMERIC(18,3),
                rate NUMERIC(18,2)
            );`;

            const createItemMasterTableQuery = `
            CREATE TABLE public.item_master (
                item_code VARCHAR(20),
                item_name VARCHAR(200)
            );`;

            await client.query(createHeaderTableQuery);
            await client.query(createDetailTableQuery);
            await client.query(createItemMasterTableQuery);
            console.log('Tables created');
        }
        return
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

export const connectDB = async () => {
    try {
        client.connect()
        console.log('Database connected')
        await createTables()
    } catch (error) {
        console.log('Error connecting database ', error)
    }
}

// client.on('connect',()=>{
//     console.log('DB connected');
// })

client.on('end', () => {
    console.log('Connection end');
})


export default client
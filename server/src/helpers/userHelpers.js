import client from "../config/dbConnection.js"

export const userHelpers = {
    // Find header table by voucher number
    voucherNumberCheck:async(vr_no)=>{
        try{
            const query = `SELECT vr_no FROM header_table WHERE vr_no = $1`;
            const value = [vr_no]
            const response = await client.query(query,value)
            if(response){
                return response.rows
            }
        }catch(error){
            console.error('Error fetching table data:', error);
        }
    },
    // Save invoice header seperately
    saveInvoiceHeader:async({vr_no, vr_date, status, ac_name, ac_amt})=>{
        try{
            const query = `INSERT INTO header_table (vr_no, vr_date, status, ac_name, ac_amt)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const values = [vr_no, vr_date, status, ac_name, ac_amt]
            const response = await client.query(query,values)
            if(response){
                return response.rows
            }
        }catch(error){
            console.error('Error inserting values into header_table:', error);
        }
    },
    // Save detail table seperately
    saveInvoiceDetails:async(detail_table)=>{
        try{
            for(const detail of detail_table){
                const query = `INSERT INTO detail_table (vr_no, sr_no, item_code, item_name, description, qty, rate)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`;
                const values = [detail.vr_no, detail.sr_no, detail.item_code, detail.item_name, detail.description, detail.qty, detail.rate]
                await client.query(query,values)
            }
            return true
        }catch(error){
            console.error('Error inserting values into detail_table:', error);
        }
    },
    // Get all header table data
    getDataSaved:async()=>{
        try{
            const searchQuery = `SELECT * FROM header_table ORDER BY vr_no ASC`
            const response = await client.query(searchQuery,[])
            if(response){
                return response.rows
            }
        }catch(error){
            console.error('Error getting Header table data', error);
        }
    },
    // Get a particular detail table with a voucher number
    getSingleVoucherDetails:async(vr_no)=>{
        try{
            const searchQuery = `SELECT * FROM detail_table WHERE vr_no = $1 ORDER BY sr_no ASC`;
            const value = [vr_no]
            const response = await client.query(searchQuery,value)
            if(response){
                return response.rows
            }
        }catch(error){
            console.error('Error getting Details table', error);
        }
    }
}
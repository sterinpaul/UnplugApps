import baseUrl from "./baseUrl";

export const getListItems = async()=>{
    try{
        const response = await baseUrl.get('/getitem')
        if(response) return response.data
    }catch(error){
        throw new Error('Error while data fetching from server')
    }
}

export const saveInvoiceToDb = async(header_table,detail_table)=>{
    try{
        const response = await baseUrl.post('/save',{header_table,detail_table})
        if(response) return response.data
    }catch(error){
        throw new Error('Error while data fetching from server')
    }
}


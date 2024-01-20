import baseUrl from "./baseUrl";
import axios from 'axios'

export const getListItems = async()=>{
    try{
        const response = await axios.get('http://5.189.180.8:8010/item')
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

export const getSavedData = async()=>{
    try{
        const response = await baseUrl.get('/getsaved')
        if(response) return response.data
    }catch(error){
        throw new Error('Error while fetching saved invoices from server')
    }
}

import { userHelpers } from "../helpers/userHelpers.js"

export const controllers = {
    // Save the data into tables
    saveData:async(req,res)=>{
        const {header_table,detail_table} = req.body
        const voucherExists = await userHelpers.voucherNumberCheck(header_table.vr_no)
        if(voucherExists.length){
            res.json({status:false})
        }else{
            const response1 = await userHelpers.saveInvoiceHeader(header_table)
            const response2 = await userHelpers.saveInvoiceDetails(detail_table)
            if(response1 && response2) res.json({status:true})
        }
    },
    // Get saved all header tables
    getsavedData:async(req,res)=>{
        const headerData = await userHelpers.getDataSaved()
        if(headerData){
            res.json(headerData)
        }
    },
    // Get single detail table with a voucher number
    getSingleVoucherData:async(req,res)=>{
        const {vr_no} = req.params
        const data = await userHelpers.getSingleVoucherDetails(vr_no)
        if(data){
            res.json({status:true,data})
        }
    }
}
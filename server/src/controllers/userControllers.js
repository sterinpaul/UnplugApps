import { userHelpers } from "../helpers/userHelpers.js"

export const controllers = {
    getItemList:async(req,res)=>{
        const response = await fetch('http://5.189.180.8:8010/item').then((data)=>{
            return data.json()
        })
        res.json(response)
    },
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
    }
}
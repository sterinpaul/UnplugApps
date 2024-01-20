import { useState, useRef, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import moment from 'moment'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { v4 as uuid } from 'uuid'
import { TrashIcon } from "@heroicons/react/20/solid";
import { toast } from 'react-toastify'
import { saveInvoiceToDb, getListItems, getSavedData } from "../api/apiConnections";
import ReactToPrint from 'react-to-print'
import {
    Dialog,
    DialogFooter,
} from "@material-tailwind/react";
const TABLE_HEAD = ['Sr No.', 'Item Code', 'Item Name', 'Description', 'Qty', 'Rate', 'Amount']
const TABLE_ACCOUNT = ['Vr No.', 'Vr Date', 'Account Name', 'Status', 'Amount']


const Body = () => {
    const itemCodeRef = useRef(null)
    const voucherFocus = useRef(null)
    const printRef = useRef()
    const [item_code, setItemCode] = useState('ITEM 111')
    const [item_name, setItemName] = useState('ITEM NAME 111')
    const [description, setDescription] = useState('')
    const [qty, setItemQty] = useState('')
    const [rate, setItemRate] = useState('')
    const [singleTotal, setSingleTotal] = useState('')
    const [data, setData] = useState([])
    const [total, setTotal] = useState('')
    const [entryRowState, setEntryRowState] = useState(true)
    const [btnDisableStatus, setBtnDisableStatus] = useState(false)
    const [saveBtn, setSaveBtn] = useState(false)
    const [printBtn, setPrintBtn] = useState(false)
    const [totalInvoices, setTotalInvoices] = useState([])
    const [invoiceMainTotal, setInvoiceMainTotal] = useState('')

    const [open, setOpen] = useState(false)
    const handleOpen = async () => {
        setOpen(!open)
        if(!open){
            const resp = await getSavedData()
            if(resp){
                const sum = resp.reduce((a, b) => a += parseFloat(b.ac_amt), 0)
                setInvoiceMainTotal(sum)
                setTotalInvoices(resp)
            }
        }
    }

    // Item list from Unplugapps API
    const [items, setItems] = useState([])
    const getItems = async () => {
        const response = await getListItems()
        if (response) setItems(response)
    }
    useEffect(() => {
        getItems()
    }, [])





    const numberValidation = (value) => {
        return value.replace(/[^0-9]/g, '').replace(/^0+/, '')
    }

    const nameValidation = (e) => {
        const updatedName = e.target.value.toUpperCase().replace(/[^a-zA-Z ]|\s{2,}/g, '')
        formik.setFieldValue('ac_name', updatedName)
    }

    const itemHandler = (e) => {
        setItemCode(e.target.value)
        const index = items.findIndex((single) => single.item_code === e.target.value)
        setItemName(items[index].item_name)
    }

    const handleItemQty = (e) => {
        const value = numberValidation(e.target.value)
        setItemQty(value)
        if (rate) {
            setSingleTotal(e.target.value * rate)
            const mainTotal = data.reduce((a, b) => { return a += b.qty * b.rate }, 0)
            setTotal(mainTotal + (e.target.value * rate))
            formik.setFieldValue('ac_amt', mainTotal + (e.target.value * rate))
        }
    }

    const handleItemRate = (e) => {
        const value = numberValidation(e.target.value)
        setItemRate(value)
        if (qty) {
            setSingleTotal(e.target.value * qty)
            const mainTotal = data.reduce((a, b) => { return a += b.qty * b.rate }, 0)
            setTotal(mainTotal + (e.target.value * qty))
            formik.setFieldValue('ac_amt', mainTotal + (e.target.value * qty))
        }
    }


    const setVoucherNumber = (e) => {
        const updatedVal = numberValidation(e.target.value)
        const value = updatedVal.slice(0, 10)
        formik.setFieldValue('vr_no', value)
    }

    const createNewRow = () => {
        if (item_code && item_name && description && qty && rate) {
            const newData = {
                vr_no: uuid(), item_code, item_name, description, qty, rate
            }
            setData((prevs) => [...prevs, newData])
            setItemCode('ITEM 111')
            setItemName('ITEM NAME 111')
            setDescription('')
            setItemQty('')
            setItemRate('')
            setSingleTotal('')
        } else if (!entryRowState) {
            setEntryRowState(true)
        }
        setTimeout(() => itemCodeRef.current.focus(), 0)
    }

    const formik = useFormik({
        initialValues: {
            vr_no: '',
            vr_date: moment().format('YYYY-MM-DD'),
            status: 'A',
            ac_name: '',
            ac_amt: ''
        },
        validationSchema: Yup.object(
            {
                vr_no: Yup.string()
                    .max(10, 'Maximum 10 digits allowed')
                    .min(1, 'Enter atleast 1 digit')
                    .required('Required'),
                vr_date: Yup.string()
                    .required('Required'),
                status: Yup.string()
                    .required('Required'),
                ac_name: Yup.string()
                    .matches(/^[A-Z a-z]+$/, 'Invalid name')
                    .max(30, 'Must be less than 30 characters')
                    .min(3, 'Must be more than 3 characters')
                    .required('Required'),
                ac_amt: Yup.string()
                    .required('Required')
            }
        ),
        onSubmit: async (values) => {
            if (item_code && item_name && description && qty && rate || !entryRowState) {
                setSaveBtn(true)
                setBtnDisableStatus(true)
                const saveFunction = async (invData) => {
                    values.vr_no = Number(values.vr_no)
                    values.ac_amt = total
                    const finalData = invData.map((single, index) => { return { ...single, vr_no: Number(values.vr_no), sr_no: (index + 1), qty: Number(single.qty), rate: Number(single.rate) } })
                    const response = await saveInvoiceToDb(values, finalData)
                    if (!response.status) {
                        setSaveBtn(false)
                        toast.error('Voucher number already exists')
                    } else {
                        setPrintBtn(true)
                        toast.success('Invoice saved successfully')
                    }
                }

                if (entryRowState) {
                    const newData = {
                        vr_no: values.vr_no, item_code, item_name, description, qty, rate
                    }
                    data.push(newData)
                }
                setEntryRowState(false)
                saveFunction(data)
            }
        }
    })

    const formikReset = () => {
        formik.resetForm({
            values: formik.initialValues,
        });
    }

    const clearRowData = () => {
        setItemCode('ITEM 111')
        setItemName('ITEM NAME 111')
        setDescription('')
        setItemQty('')
        setItemRate('')
        setSingleTotal('')
    }

    const clearScreen = async () => {
        setSaveBtn(false)
        setPrintBtn(false)
        setBtnDisableStatus(false)
        clearRowData()
        formikReset()
        setTotal('')
        setData([])
        if (!entryRowState) setEntryRowState(true)
        setTimeout(() => voucherFocus.current.focus(), 0)
    }

    const removeSingleRow = (uid, singleTotal) => {
        const updated = data.filter((single) => single.vr_no !== uid)
        setTotal(prevs => prevs -= singleTotal)
        setData(updated)
        if (data.length === 1) setEntryRowState(true)
    }

    const printInvoice = () => {
        window.print()
    }

    return (
        <div className="pt-16 h-screen overflow-x-scroll">
            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col justify-center m-4 gap-2 lg:flex-row">
                    <div ref={printRef} className="shadow-2xl overflow-x-scroll rounded">

                        <p className="text-center text-blue-500 text-3xl mt-2 uppercase" style={{ textShadow: '1px 1px 2px black' }}>Invoice</p>
                        {/* Header section */}
                        <div className="p-4">
                            <div className="flex justify-between flex-wrap">
                                <div className="flex items-center gap-1">
                                    <label htmlFor='vr_no'>Vr No:</label>
                                    <input ref={voucherFocus} id='vr_no' onChange={setVoucherNumber} value={formik.values.vr_no} className="w-24 bg-gray-100 pl-1 outline-none rounded" type="text" maxLength={10} />
                                    <p className="h-4 ml-2 text-xs text-red-800">{formik.touched.vr_no && formik.errors.vr_no &&
                                        formik.errors.vr_no}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <label htmlFor='vr_date'>Vr Date:</label>
                                    <input id='vr_date' className="w-28 bg-gray-100 pl-1 outline-none rounded" type="text" value={moment().format('YYYY-MM-DD')} readOnly />
                                    <p className="h-4 ml-2 text-xs text-red-800">{formik.touched.vr_date && formik.errors.vr_date &&
                                        formik.errors.vr_date}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <label htmlFor='status'>Status:</label>
                                    <select id='status' {...formik.getFieldProps('status')} >
                                        <option>A</option>
                                        <option>I</option>
                                    </select>
                                    <p className="h-4 ml-2 text-xs text-red-800">{formik.touched.status && formik.errors.status &&
                                        formik.errors.status}</p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-4 gap-4 flex-wrap">
                                <div className="flex items-center gap-1">
                                    <label htmlFor='ac_name'>Ac Name:</label>
                                    <input id='ac_name' className="bg-gray-100 pl-1 outline-none rounded" type="text" value={formik.values.ac_name} onChange={nameValidation} maxLength={30} />
                                    <p className="h-4 ml-2 text-xs text-red-800">{formik.touched.ac_name && formik.errors.ac_name &&
                                        formik.errors.ac_name}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <label htmlFor='ac_amt'>Ac Amt:</label>
                                    <input id='ac_amt' value={total} className="w-20 bg-gray-100 text-right pr-1 outline-none rounded" type="text" readOnly tabIndex={-1} />
                                </div>
                            </div>
                        </div>

                        <hr />

                        {/* Details section */}
                        <Card className="h-full w-full overflow-scroll p-2 rounded-none">
                            <table className="w-full min-w-max">
                                <caption className="caption-top">
                                    Details
                                </caption>
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th key={head} className="border border-blue-gray-100 bg-blue-gray-50 p-2">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none"
                                                >
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data && data.map(({ vr_no, item_code, item_name, description, qty, rate }, index) => {
                                        return (
                                            <tr key={vr_no}>
                                                <td className="border border-slate-300 pl-1 text-center">{index + 1}</td>
                                                <td className="w-44 border border-slate-300 pl-1 text-left">{item_code}</td>
                                                <td className="w-44 border border-slate-300 pl-1 text-left">{item_name}</td>
                                                <td className="w-44 border border-slate-300 pl-1 text-left">{description}</td>
                                                <td className="w-20 border border-slate-300 pr-1 text-right">{qty}</td>
                                                <td className="w-20 border border-slate-300 pr-1 text-right">{rate}</td>
                                                <td className="border border-slate-300 pr-1 text-right">{qty * rate}</td>
                                                <td className="text-center">{!btnDisableStatus && <TrashIcon onClick={() => removeSingleRow(vr_no, qty * rate)} className="w-5 h-5 cursor-pointer text-red-400" />}</td>
                                            </tr>
                                        )
                                    })}
                                    {entryRowState && <tr>
                                        <td className="border border-slate-300 text-center">{data.length + 1}</td>
                                        {/* <td className="border border-slate-300"><input ref={itemCodeRef} value={item_code} onChange={(e) => setItemCode(e.target.value.toUpperCase())} className="outline-none pl-1" type="text" maxLength={20} /></td>
                                        <td className="border border-slate-300"><input value={item_name} onChange={(e) => setItemName(e.target.value.toUpperCase())} className="outline-none pl-1" type="text" maxLength={20} /></td> */}


                                        <td className="border border-slate-300">
                                            <select onChange={itemHandler} ref={itemCodeRef} className="focus:outline">
                                                {items && items.map(({ item_code }, index) => <option key={index}>{item_code}</option>)}
                                            </select>
                                        </td>
                                        <td className="border border-slate-300 pl-1">{item_name}</td>


                                        <td className="border border-slate-300"><input value={description} onChange={(e) => setDescription(e.target.value)} className="outline-none pl-1" type="text" maxLength={30} /></td>
                                        <td className="border border-slate-300 text-right"><input value={qty} onChange={handleItemQty} className="outline-none w-20 text-right pr-1" type="text" maxLength={8} /></td>
                                        <td className="border border-slate-300 text-right"><input value={rate} onChange={handleItemRate} className="outline-none w-20 text-right pr-1" type="text" maxLength={8} /></td>
                                        <td className="border border-slate-300 pr-1 text-right">{singleTotal}</td>
                                        <td className="text-center">{data.length ? <TrashIcon onClick={() => { setEntryRowState(false); clearRowData() }} className="w-5 h-5 cursor-pointer text-red-400" /> : null}</td>
                                    </tr>}
                                    <tr>
                                        <td className="text-right pr-2" colSpan={6}>Total</td>
                                        <td className="border border-slate-300 text-right pr-1">{total}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card>
                    </div>
                    <div className="flex justify-center lg:flex-col">
                        <button type="button" className="px-4 py-2 rounded border bg-blue-500 text-white hover:text-black hover:bg-blue-gray-200" onClick={clearScreen} >New</button>
                        <button type="button" disabled={btnDisableStatus} className={`px-4 py-2 rounded border ${btnDisableStatus ? 'bg-blue-gray-200' : 'bg-blue-500'}  text-white hover:text-black hover:bg-blue-gray-200`} onClick={createNewRow}>Insert</button>
                        <button type="submit" disabled={saveBtn} className={`px-4 py-2 rounded border ${saveBtn ? 'bg-blue-gray-200' : 'bg-blue-500'}  text-white hover:text-black hover:bg-blue-gray-200`}>Save</button>
                        {/* <button type="button" disabled={!btnDisableStatus} className={`px-4 py-2 rounded border ${btnDisableStatus ? 'bg-blue-500' : 'bg-blue-gray-200'}  text-white hover:text-black hover:bg-blue-gray-200`} onClick={printInvoice} >Print</button> */}
                        <ReactToPrint
                            bodyClass="print-agreement"
                            content={() => printRef.current}
                            trigger={() => (
                                <button type="button" disabled={!printBtn} className={`px-4 py-2 rounded border ${printBtn ? 'bg-blue-500' : 'bg-blue-gray-200'}  text-white hover:text-black hover:bg-blue-gray-200`}>
                                    Print
                                </button>
                            )}
                        />
                        <button type='button' className="px-4 py-2 rounded border bg-blue-500 text-white hover:text-black hover:bg-blue-gray-200" onClick={handleOpen}>View</button>
                    </div>
                </div>
            </form>
            <Dialog className="flex flex-col items-center p-2" open={open} handler={handleOpen} size="xl">
                <table className="w-full min-w-max table-auto">
                    <caption className="caption-top">
                        Invoices
                    </caption>
                    <thead>
                        <tr>
                            {TABLE_ACCOUNT.map((head) => (
                                <th key={head} className="border border-blue-gray-100 bg-blue-gray-50 p-2">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {totalInvoices && totalInvoices.map(({ vr_no, vr_date, status, ac_name, ac_amt }) => {
                            return (
                                <tr key={vr_no}>
                                    <td className=" border border-slate-300 text-center">{vr_no}</td>
                                    <td className=" border border-slate-300 text-center">{moment(vr_date).format('DD-MM-yyyy')}</td>
                                    <td className=" border border-slate-300 text-left pl-2">{ac_name}</td>
                                    <td className=" border border-slate-300 text-center">{status}</td>
                                    <td className=" border border-slate-300 text-right pr-2">{ac_amt}</td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td className="text-right pr-2" colSpan={4}>Total</td>
                            <td className="border border-slate-300 text-right pr-1">{invoiceMainTotal}</td>
                        </tr>
                    </tbody>
                </table>
            </Dialog>
        </div>
    )
}

export default Body
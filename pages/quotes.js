import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession } from "next-auth/react";
import { getSession } from "@lib/auth/session";

import { useState, useRef } from "react";
import { FolderIcon } from "@heroicons/react/outline";
import { read, utils, writeFile } from 'xlsx';



// interface Item {
//   Asset: number;
//   Type: string;
//   Description: string;
//   Manufacturer: string;
//   Model: string;
//   Serial: string;
//   Status: string;
//   Account: string;
//   Site: string;
//   Calibration_date: Date;
//   Due_date: Date;
//   Calibration_product_code: string;

// }

const Page = () => {
  const [files, setFiles] = useState([])
  // const [errors, setErrors] = useState([])
//   const [fromDate, setFromDate] = useState('')
//   const [toDate, setToDate] = useState('')
//   const [items, setItems] = useState<Item[]>([])
  
  const [data, setData] = useState({})
  const { status, data: session } = useSession({required: false});
  const ref = useRef(null)

  

  const handleImport = ($event) => {
    const files = $event.target.files;
    if (files.length) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const wb = read(event.target.result);
            const sheets = wb.SheetNames;

            if (sheets.length) {
                const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                setData(rows)
            }
        }
        setFiles(files)
        reader.readAsArrayBuffer(file);
    }
}

  const handleExport = () => {
      const headings = [[
          'Item',
          'Unit Code',
          'QTY',
          'Availability'
      ]];
      const wb = utils.book_new();
      const ws = utils.json_to_sheet([]);
      utils.sheet_add_aoa(ws, headings);
      utils.sheet_add_json(ws, data, { origin: 'A2', skipHeader: true });
      utils.book_append_sheet(wb, ws, 'Report');
      writeFile(wb, 'Quotation Report.xlsx');
  }

  const formatCode = (text) => {
    const result = /([^-]*)-/.exec(text)[1]
    
    return result
  }


 
  return (
    <>
      
      <AppLayout>
      <>
        <div className="flex w-full flex-col ">
           <div className="flex justify-center flex-row p-20">
                <div className="flex justify-center text-center w-full ">
                    <label htmlFor="fileInput" className="flex flex-col justify-center items-center w-full h-64  rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                       {!files.length ? <div className="flex flex-col justify-center items-center">
                            {/* <svg aria-hidden="true" class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg> */}
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">.XLSX (MAX. 5MB)</p>
                        </div>:
                        <>
                            <FolderIcon className="h-5 w-5"/>
                            <p className="mb-2 text-lg font-bold text-blue-400 dark:text-gray-400">{files[0].name}</p>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload a different file</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">.XLSX (MAX. 5MB)</p>
                        </>
                        }
                        <input id="fileInput" type="file" className="hidden absolute" onChange={handleImport} accept=".xls,.xlsx"/>
                    </label>
                </div> 
                                
                        {/* <div className="">
                            <button onClick={handleExport} className="">
                                Export <i className="fa fa-download"></i>
                            </button>
                        </div> */}
 
            </div>
            {data.length && <div className="mt-10">
                <div className="mt-14 mb-14">
                    
                    <div className="flex justify-between min-w-full mb-10">
                        
                        <div>
                            <div className="p-20 m-5 hover:cursor-pointer border-dashed border-2 border-gray-300 hover:bg-gray-100" onClick={() => ref.current?.click()}>
                                <p className="font-bold">Company Logo</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center"><span className="font-semibold">Click to upload</span></p>
                            </div>
                            
                            <input  type="file"
                                    id="filePicker"
                                    ref={ref}
                                    accept="image/*"
                                    className="hidden"
                            />
                           
                            
                        </div>
                        <div>
                        <div className="p-20 hover:cursor-pointer text-center bg-gray-50">
                            <p className="font-bold">Quote Prepared for:</p>
                            <div className="mt-2">
                                <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder="Jane Doe..." type="text" name="search"/>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="pb-14">
                        <table className="min-w-full">
                            <thead className="border rounded-md">
                                <tr className="border rounded-md">
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO NUMBER</th>
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALES CONTACT</th>
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLS ID</th>
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CALIBRATION TYPE</th>
                                   
                                </tr>
                            </thead>
                            <tbody className="">
                                <tr className="m-2">
                                    <td className="px-6 py-3">
                                        <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder="PO NUMBER..." type="text" name="search"/>
                                    </td>
                                    <td className="px-6 py-3">
                                        <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder="SALES CONTACT..." type="text" name="search"/>
                                    </td>
                                    <td className="px-6 py-3">
                                        <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder="SLS ID..." type="text" name="search"/>
                                    </td>
                                    <td className="px-6 py-3">
                                        <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder="CALIBRATION TYPE..." type="text" name="search"/>
                                    </td>

                                </tr>
                            </tbody>
                        </table> 
                    </div>
                    <div className="font-semibold italic mt-10">*A purchase order or credit card must be provided prior to service work commencing.</div>


                    <div className="flex justify-between min-w-full mt-10">
                        <div>
                            <span className="mb-5 font-bold">Filter By:</span>
                            <select className="mt-5 block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" required>
                                <option>Site Address</option>
                            </select>
                            
                        </div>
                        <div>
                            <span className="font-bold">Dates Between:</span>
                            
                            <div className="mt-2"><input type="date"></input></div>
                            <div className="mt-2"><input type="date"></input></div>
                            {/* <div date-rangepicker className="flex items-center mt-5">
                                <div className="relative w-full">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                                    </div>
                                    <input name="start" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Start Date"/>
                                </div>
                                <span className="mx-4 text-gray-500">to</span>
                                <div className="relative w-full">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                                    </div>
                                    <input name="end" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="End Date"/>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    
                    {/* Quote Table */}


                    <table className="min-w-full mt-10">
                        <thead className="border rounded-md">
                            <tr className="border rounded-md">
                                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Code</th>
                                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTY</th>
                                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                            </tr>
                        </thead>
                        <tbody className=""> 
                                {
                                    data.length
                                    ?
                                    data.map((item, index) => (
                                        <tr key={index}>
                                            <th scope="row">{ index + 1 }</th>
                                            <td className="px-6 py-2">
                                                <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder={ item["Asset Type"]} type="text"/>
                                                {/* { item["Asset Type"]} */}
                                            </td>
                                            <td className="px-6 py-2">
                                                <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder={ formatCode(item["Calibration Product Code"])} type="text"/>
                                                {/* { formatCode(item["Calibration Product Code"])} */}
                                            </td>
                                            <td className="px-6 py-2">
                                                <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder={ item.Director } type="text"/>
                                                {/* { item.Director } */}
                                            </td>
                                            <td className="px-6 py-2">
                                                <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder="" type="text"/>
                                                {/* <span className="badge bg-warning text-dark">-</span> */}
                                            </td>
                                        </tr> 
                                    ))
                                    :
                                    <tr>
                                        <td colSpan="5" className="text-center">No Items Found.</td>
                                    </tr> 
                                }
                        </tbody>
                    </table>
                </div>
                
            </div>}
            
            
        </div>
        <div className="bg-gray-50 p-20">
            <div className="flex justify-end min-w-full font-bold">
                <div className="flex flex-col">Estimated hours on Site:</div>
                <input className="placeholder:italic ml-4" placeholder=""></input>
            </div>
            <div className="flex justify-end min-w-full font-bold mt-5">
                <div className="flex flex-col">Estimated Total Price: </div>
                <input className="placeholder:italic ml-4" placeholder=""></input>
            </div>
        </div>
        <div className="flex justify-start min-w-full font-bold mt-5">
            <div>Date: </div>
            <input className="placeholder:italic ml-4" placeholder=""></input>
        </div>
        </>
      </AppLayout>
      
    </>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}

export default Page;

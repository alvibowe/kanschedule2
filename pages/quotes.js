import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession } from "next-auth/react";
import { getSession } from "@lib/auth/session";
import Files from "react-butterfiles";
import { useState } from "react";
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
  const [data, setData] = useState({})
  const { status, data: session } = useSession({required: false});
  

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




  console.log(files);
  return (
    <>
      <AppLayout>
        <div className="flex w-full flex-col ">
           <div className="flex justify-center flex-row p-20">
                <div className="flex justify-center text-center w-full ">
                    <label htmlFor="fileInput" className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                       {!files.length ? <div className="flex flex-col justify-center items-center">
                            {/* <svg aria-hidden="true" class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg> */}
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">.XLSX (MAX. 2MB)</p>
                        </div>:
                        <>
                            <FolderIcon className="h-5 w-5"/>
                            <p className="mb-2 text-lg font-bold text-blue-400 dark:text-gray-400">{files[0].name}</p>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload a different file</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">.XLSX (MAX. 2MB)</p>
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
                    <div className="flex justify-around min-w-full mb-10">
                        <div>Company Logo and Info</div>
                        <div>Quote prepared for: </div>
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
                            <tbody className=""></tbody>
                        </table> 
                    </div>
                    <div className="font-bold mt-10">*A purchase order or credit card must be provided prior to service work commencing.</div>
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
                                            <td>{ item["Asset Type"]}</td>
                                            <td>{ formatCode(item["Calibration Product Code"])}</td>
                                            <td>{ item.Director }</td>
                                            <td><span className="badge bg-warning text-dark">Mobile Lab</span></td>
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
                {/* <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-end-7 col-span-2">Date: </div>
                </div> */}
            </div>}
            
        </div>
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

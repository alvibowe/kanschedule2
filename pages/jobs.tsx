import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { useQuery } from "react-query";
import superagent from "superagent";
import { TrashIcon } from "@heroicons/react/outline";
import { isAccordionItemSelected } from "react-bootstrap/esm/AccordionContext";
import { format } from 'date-fns'

import Loader from "@lib/components/Loader";

const Page = () => {
  const [data, setData] = useState([]);
  const { status, data: session } = useSession({
    required: false,
  });

  const withSessionQuery = useQuery(
    ["with-session-example", session],
    async () => {
      
      const data = await superagent.get("/api/quotes").then((res) => res.body);
      setData(data);
      return data
    },
    {
      // The query will not execute until the session exists
      enabled: !!session,
    }
  );

  const handleDelete = async (id: any) => {
    fetch('/api/delete-quote/', {
      method: 'DELETE',
      body: JSON.stringify({
        id: id,
      }),
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  if (status === "loading") {
    return "Loading or not authenticated...";
  }

 
  if (!session) {
    return (
      <>
        <AppLayout title="With Session">
          <blockquote>
            <Loader/>
          </blockquote>
        </AppLayout>
      </>
    );
  }

  return (
    <>
      <AppLayout >
        <div className="flex justify-center">
  
          {data &&
              <div >
                <table className="min-w-full mt-10 ">
                        <thead className="border rounded-md">
                            <tr className="border rounded-md">
                                {/* <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:block">No</th> */}
                                {/* <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:block">Id</th> */}
                                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote Id</th>
                                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                
                            </tr>
                        </thead>
                        <tbody className="min-w-full"> 
                                {
                                    data?.length
                                    ?
                                    data.map((item, index) => (
                                        <tr key={index}>
                                            {/* <th scope="row" className="hidden md:block">{ index + 1 }</th> */}
                                            {/* <td className="px-6 py-2">
                                                <input className="placeholder:italic placeholder:text-slate-800 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" value={ item.id} type="text"/>  
                                            </td> */}
                                            <td className="px-6 py-2">
                                                <input className="placeholder:italic placeholder:text-slate-800 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" value={ item.quoteId} type="text"/>  
                                            </td>
                                            <td className="px-6 py-2">
                                                <input className="placeholder:italic placeholder:text-slate-800 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" value={ item.createdAt } type="text"/>
                                            </td>
                                            <td className="px-6 py-2">
                                              <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" required>
                                                {(session?.user as any)?.role !== "technician" ?
                                                  <>
                                                    <option>Quoted</option>
                                                    <option>Scheduled</option>
                                                    <option>Confirmed</option>
                                                    <option>Dispatched</option>
                                                  </>
                                                : null}
                                                {(session?.user as any)?.role === "technician" || (session?.user as any)?.role === "system manager" ?
                                                  <>
                                                    
                                                    <option>On-Site</option>
                                                    <option>Canceled(No Reschedule)</option>
                                                    <option>Canceled(Reschedule)</option>
                                                  </>
                                                : null}
                                              </select>
                                            </td>
                                            
                                            { (session?.user as any)?.role === "scheduling administrator" || (session?.user as any)?.role === "system manager" ?
                                              <td><TrashIcon className="h-5 w-5 hover:text-red-400 hover:cursor-pointer" onClick={() => handleDelete(item.quoteId)}/></td>
                                            : null }
                                        </tr> 
                                    ))
                                    :
                                    <tr>
                                        <td className="flex justify-center text-center ">No Items Found.</td>
                                    </tr> 
                                }
                        </tbody>
                    </table>
              </div>
           
          }
        </div>
      </AppLayout>
    </>
  );
};

export default Page;

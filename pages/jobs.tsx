import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { useQuery } from "react-query";
import superagent from "superagent";
import { TrashIcon } from "@heroicons/react/outline";

const Page = () => {
  const [data, setData] = useState([]);
  const { status, data: session } = useSession({
    required: false,
  });

  const withSessionQuery = useQuery(
    ["with-session-example", session],
    async () => {
      console.log(session);
      const data = await superagent.get("/api/quotes").then((res) => res.body);
      setData(data);
      return data
    },
    {
      // The query will not execute until the session exists
      enabled: !!session,
    }
  );

  if (status === "loading") {
    return "Loading or not authenticated...";
  }

 
  if (!session) {
    return (
      <>
        <AppLayout title="With Session">
          <blockquote>
            <h1>Access Denied</h1>
            {/* <h1>
              <button type="button" onClick={() => signIn()}>
                <a>Login</a>&nbsp;
              </button>
              
            </h1> */}
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
                        <tbody className=""> 
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
                                                <input className="placeholder:italic placeholder:text-slate-800 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" value={ item.status } type="text"/>
                                            </td>
                                            
                                            {/* <td><TrashIcon className="h-5 w-5 hover:bg-red-400 hover:cursor-pointer"/></td> */}
                                        </tr> 
                                    ))
                                    :
                                    <tr>
                                        <td className="flex justify-center text-center min-w-full">No Items Found.</td>
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

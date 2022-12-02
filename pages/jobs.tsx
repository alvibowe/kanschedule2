import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import superagent from "superagent";
import { TrashIcon } from "@heroicons/react/outline";
import { isAccordionItemSelected } from "react-bootstrap/esm/AccordionContext";
import { format } from 'date-fns'
import Loader from "@lib/components/Loader";
import { useRouter } from 'next/router'


const Page = () => {
  const [data, setData] = useState([]);
  const { status, data: session } = useSession({
    required: false,
  });

  useEffect(() => {
    router.push('/jobs')
  }, [data]);



  const router = useRouter()






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
    
    await fetch('/api/delete-quote/', {
      method: 'DELETE',
      body: JSON.stringify({
        id: id,
      }),
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((res) => {
      if (res.ok) {
        router.reload()
      }
    }
    
    
    )

  
    

  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center mt-40">
        <Loader/>
      </div>
    
    );
  }

 
  if (!session) {
    return (
      <>
        <div className="min-h-screen flex justify-center items-center mt-40">
          <Loader/>
        </div>
      </>
    );
  }

  return (
    <>
      <AppLayout >
        <div className="flex justify-center">
  
          {data.length ?
              <div className="">
                {
                 data.map((item, index) => (
                  <div>
                  <div className="flex flex-row justify-between space-x-4 font-extrabold mb-5">
                        {index + 1}.
                  </div>
                  <div key={index} className="bg-gray-100 rounded-lg drop-shadow-lg p-10 mb-5">
                    <div className="flex flex-wrap justify-between flex-col space-y-4">
                      
                      <div className="flex flex-row justify-between space-x-4">
                        <div>
                          <span className="font-bold">Quote ID:  </span>
                          { item.quoteId }
                        </div>
                        <div>
                          <span className="font-bold">Created At:  </span>
                          { item.createdAt }
                        </div>
                      </div>
                      <div className="flex flex-row space-x-4">
                        <span className="font-bold mr-1">Status: </span>
                        <span className="bg-red-200 rounded-lg p-1 text-sm">{item.status.toUpperCase()}</span>
                      </div>
                      <div className="flex flex-row justify-end space-x-4">
                        <div className="text-base font-extrabold hover:cursor-pointer bg-black text-white p-2 rounded" >Schedule</div>
                        <TrashIcon className="h-5 w-5 mt-2 hover:text-red-400 hover:cursor-pointer" onClick={() => handleDelete(item.quoteId)}/>
                      </div>
                    </div>
                  </div>
                  </div>
                 )) 
                }
                
              </div>
           
          :   
              <div className="flex justify-center items-center mt-40">
                You currently have no jobs. (Add a job using the 'Quotes' tab)
              </div>
        }
        </div>
      </AppLayout>
    </>
  );
};

export default Page;

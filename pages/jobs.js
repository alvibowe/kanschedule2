import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import superagent from "superagent";
import { TrashIcon } from "@heroicons/react/outline";
import { DocumentIcon, PlusIcon } from "@heroicons/react/solid";

import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format } from 'date-fns'
import Loader from "@lib/components/Loader";
import { useRouter } from 'next/router';

import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';



const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});


const jobs = [
  {
      title: "Quote ID: Q-KZ3GR, Wichita KS",
      allDay: true,
      start: new Date(2022, 12, 19),
      end: new Date(2022, 12, 21),
  },
  {
      title: "Quote ID: Q-KK3BR, Odessa TX",
      start: new Date(2023, 1, 7),
      end: new Date(2023, 1, 10),
  },
  {
      title: "Quote ID: Q-KK3BR, Oklahoma City",
      start: new Date(2023, 3, 20),
      end: new Date(2023, 3, 23),
  },
];


const Page = () => {
  const [data, setData] = useState([]);
  const { status, data: session } = useSession({
    required: false,
  });
  const [open, setOpen] = useState(false)
  const [technicians, setTechnicians] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" })
  const [allEvents, setAllEvents] = useState(jobs);
  



  useEffect(() => {
    router.push('/jobs')
    allTechnicians()
  }, [data]);

  


  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);


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

  const usersQuery = useQuery(["users"], async () => {
    const data = await superagent.get("/api/users").send({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        accounts: {
          select: {
            type: true,
            provider: true,
          },
        },
      },
      // filter by role
      where: {
        role: "technician",
      }
    });

    return data.body;
  });

  const allTechnicians = () => { 
    if (usersQuery.data) {
      setTechnicians(usersQuery.data.filter((user) => user.role === "technician"))
    }
  }

  const handleDelete = async (id) => {
    
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


  const convertISODate = (date) => { 
    const newDate = new Date(date)
    return newDate.toISOString().substring(0, 10)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader/>
      </div>
    
    );
  }

 
  if (!session) {
    return (
      <>
        <div className="min-h-screen flex justify-center items-center">
          <Loader/>
        </div>
      </>
    );
  }

  // console.log(technicians)

  return (
    <>
      <AppLayout >

          <Modal open={open} onClose={onCloseModal} center>
            <div className="flex justify-center min-h-screen p-10">
              <div className="flex flex-col p-32 text-center space-y-4">
                <div className="font-bold text-lg">Select one or more technicians below:</div>
                <div>
                  <select className="bg-gray-200 border text-center border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" required>
                    <option value="" disabled selected>Select a Technician</option>
                    {technicians?.map((technician) => (
                      <option>{technician.name}</option>
                    ))} 
                  </select>
                </div>
                {/* <div className="flex justify-center">
                  <div className="mt-5 mx-1 text-base font-extrabold hover:cursor-pointer bg-black text-white p-2 rounded">Add a Technician</div>
                </div> */}

                {/* <div>
                  <Calendar localizer={localizer} events={allEvents} startAccessor="start" endAccessor="end" style={{ height: 500, margin: "50px" }}/>
                </div> */}
                
                  
                
              </div>
              
              
            </div>
          </Modal>

        <div className="flex justify-center">
          
  
          {data.length ?
              <div className="">
                {
                 data.map((item, index) => (
                  <div>
                    <div className="flex flex-row justify-between space-x-4 font-extrabold mb-5">
                          {index + 1}.
                    </div>
                  <div key={index} className="bg-gray-100 rounded-lg drop-shadow-lg p-10 mb-5 min-w-max">
                    <div className="flex flex-wrap justify-between flex-col space-y-4">
                      
                      <div className="flex flex-row justify-between space-x-4">
                        <div>
                          <span className="font-bold">Client Name:  </span>  
                        </div>
                        <div>
                          <span className="font-bold">Client Address:  </span>
                        </div>
                        
                      </div>
                      <div>
                          <span className="font-bold">Client Email:  </span>
                      </div>

                      <div className="flex flex-row justify-between space-x-4 mt-6">
                        <div>
                          <span className="font-bold">Quote ID:  </span>
                          { item.quoteId }
                        </div>
                        <div>
                          <span className="font-bold">Created On:  </span>
                          { convertISODate(item.createdAt) }
                        </div>
                      </div>

                      <div className="flex flex-row space-x-4 mt-6">
                        <span className="font-bold mr-1">Status: </span>
                        <span className="bg-red-200 rounded-lg p-1 text-sm">{item.status.toUpperCase()}</span>
                      </div>

                      <div className="flex flex-row justify-between space-x-4">
                        <div className="flex flex-row">
                         
                          <DocumentIcon className="h-6 w-5 mt-2 text-red-700 hover:scale-100"/>
                          <div className="mt-1 p-1 text-red-700 hover:font-black hover:cursor-pointer">.pdf</div>
                        </div>
                        <div className="flex justify-end space-x-4">
                          <div className="text-base font-extrabold hover:cursor-pointer bg-black text-white p-2 rounded" onClick={onOpenModal}>
                            Schedule Quote
                          </div>
                          <TrashIcon className="h-5 w-5 mt-2 hover:text-red-400 hover:font-black hover:cursor-pointer" onClick={() => handleDelete(item.quoteId)}/>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                  </div>
                 )) 
                }
                
              </div>
           
          :   
              <div className="flex justify-center items-center flex-col mt-10 space-y-4">
                <div className="flex justify-center items-center">
                  <Loader/>
                  {/* <div>Looks like you currently have no jobs. (Add a job using the 'Quotes' tab)</div> */}
                </div>
                
              </div>
        }
        </div>
       

        
      </AppLayout>
    </>
  );
};

export default Page;

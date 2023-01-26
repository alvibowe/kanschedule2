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

import DatePicker from "react-datepicker";
import { addDays, subDays } from 'date-fns';

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
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [selectedTechnician, setSelectedTechnician] = useState(false)

  const [technician, setTechnician] = useState()
  const [allCalendars, setAllCalendars] = useState([])
  const [techCalendar, setTechCalendar] = useState([])
  const [excludedDates, setExcludedDates] = useState([])
  const [quotation, setQuotation] = useState()

  useEffect(() => {
    getCalendar()
  }, [])

  useEffect(() => {
    setExcludedDates([])
    addExcludedDates() 
  }, [technician])

  useEffect(() => {
    router.push('/jobs')
    allTechnicians()
  }, [data]);

  const getCalendar = async() => {
    const calendar =  await superagent.get("/api/get-calendar").then((res) => res.body);
    setAllCalendars(calendar);
  }


  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false)
    setSelectedTechnician(false)
  };


  const router = useRouter()

  const handleSelect = (e) => {
    setSelectedTechnician(true)
    setTechnician(e.target.value);
    getTechnicianCalendar(e.target.value)
    
  }

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

  const getTechnicianCalendar = (id) => {
    const user = allCalendars.filter((calendar) => calendar.id === id)
    setTechCalendar(user[0]?.calendar || [])

    if (user[0]?.calendar?.length > 0 ) {
      setAllEvents(user[0].calendar.events)
    }
  }


  const onDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };


  const convertISODate = (date) => { 
    const newDate = new Date(date)
    return newDate.toISOString().substring(0, 10)
  }

  const loopAndAddDatesToExcluded = (startDate, endDate) => {
    const dates = []
    let currentDate = startDate
    const addDays = function (days) {
      const date = new Date(this.valueOf())
      date.setDate(date.getDate() + days)
      return date
    }
    while (currentDate <= endDate) {
      dates.push(currentDate)
      currentDate = addDays.call(currentDate, 1)
    }
    return dates
    
  }

  // add dates to excluded dates
  const addExcludedDates = () => {
    

    if(techCalendar?.events?.length > 0) {
      techCalendar.events.map((event) => {
        const dates = loopAndAddDatesToExcluded(new Date(event.start), new Date(event.end))
        setExcludedDates((excludedDates) => [...excludedDates, ...dates])
      })
      //setExcludedDates(dates)
    }
  }

  const scheduleQuotation = async () => {

    const result = await fetch('/api/schedule-quotation/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userId: technician,
          quotationId: quotation.id,
          status: "scheduled",
      }),
    })

    const quotationAddedToTechnician = await result.json()

    if(quotationAddedToTechnician){router.reload()}


  }

  const handleQuotationSubmit = (quotation) => {
    onOpenModal()
    setQuotation(quotation)
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


  //console.log(technician)
  return (
    <>
      <AppLayout >

          {technicians ? <Modal open={open} onClose={onCloseModal} center>
            <div className="flex justify-center p-10">
              <div className="flex flex-col text-center ">
                <div className="font-bold text-lg">Select a technician below:</div>
                <div className="mt-6">
                  <select className="bg-gray-200 border text-center border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" onChange={handleSelect} required>
                    <option value="" disabled selected>Select a Technician</option>
                    {technicians?.map((technician) => (
                      <option className="text-center" value={technician.id}>{technician.name}</option>
                    ))} 
                  </select>
                </div>
                <div className="mt-14">
                  {selectedTechnician && <div className="flex flex-wrap flex-col">
                    <DatePicker
                      selected={startDate}
                      onChange={onDateChange}
                      startDate={startDate}
                      endDate={endDate}
                      excludeDates={excludedDates}
                      selectsRange
                      selectsDisabledDaysInRange
                      inline
                    />
                  </div>}
                </div>
                {selectedTechnician && <div className="flex flex-wrap justify-center text-center mt-4"> 
                  <div className="m-5 text-lg font-extrabold hover:cursor-pointer bg-red-600 text-white p-2 rounded text-center" onClick={scheduleQuotation}>Schedule Job</div>
                </div>}
              </div>
              
              
            </div>
          </Modal> : 
            <div className="min-h-screen flex justify-center items-center">
              <Loader/>
            </div>
          }

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
                      
                      <div className="flex flex-row justify-between space-x-4 ">
                        <div>
                          <span className="font-bold">Client Name:  </span>
                          { item.clientName}  
                        </div>
                        <div>
                          <span className="font-bold">Client Email:  </span>
                          { item.clientEmail}
                      </div>
                        
                      </div>
                      <div>
                          <span className="font-bold ">Client Address:  </span>
                          { item.clientAddress}
                      </div>
                      

                      <div className="flex flex-row justify-between space-x-4  pt-6">
                        <div>
                          <span className="font-bold">Quote ID:  </span>
                          { item.quoteId }
                        </div>
                        <div>
                          <span className="font-bold">Created On:  </span>
                          { convertISODate(item.createdAt) }
                        </div>
                      </div>

                      <div className="flex flex-row justify-between space-x-4  mt-6">
                        <div>
                          <span className="font-bold">Total Hours:  </span>
                          { item.totalHours}
                        </div>
                        <div>
                          <span className="font-bold">Total Price:  </span>
                          { item.totalPrice}
                        </div>
                      </div>

                      <div className="flex flex-row space-x-4 pt-6">
                        <span className="font-bold mr-1">Status: </span>
                        <span className="bg-red-400 rounded-lg p-1 text-sm font-bold text-white">{item.status.toUpperCase()}</span>
                      </div>

                      <div className="flex flex-row justify-end space-x-6">
                        {/* <div className="flex flex-row">
                         
                          <DocumentIcon className="h-6 w-5 mt-2 text-red-700 hover:scale-100"/>
                          <div className="mt-1 p-1 text-red-700 hover:font-black hover:cursor-pointer">.pdf</div>
                        </div> */}
                        <div className="flex justify-end space-x-4">
                          <div className="text-base font-extrabold hover:cursor-pointer bg-black text-white p-2 rounded" onClick={() => handleQuotationSubmit(item)}>
                            Schedule Quote
                          </div>
                          <TrashIcon className="h-5 w-5 mt-3 hover:text-red-400 hover:font-black hover:cursor-pointer" onClick={() => handleDelete(item.quoteId)}/>
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

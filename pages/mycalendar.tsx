import AppLayout from "../lib/components/Layouts/AppLayout";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import format from "date-fns/format";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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


// temporary events
const events = [
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
  const { data: session } = useSession();
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" })
  const [allEvents, setAllEvents] = useState(events as any);

  const  handleAddEvent = () => {
        
    for (let i=0; i<allEvents.length; i++){

        const d1 = new Date (allEvents[i].start);
        const d2 = new Date(newEvent.start);
        const d3 = new Date(allEvents[i].end);
        const d4 = new Date(newEvent.end);


         if (
          ( (d1  <= d2) && (d2 <= d3) ) || ( (d1  <= d4) &&
            (d4 <= d3) )
          )
        {   
            alert("CLASH"); 
            break;
         }

    }
    
    
    setAllEvents([...allEvents, newEvent]);
}

  return (
    <>
        <AppLayout>
            <div className="flex justify-center flex-col min-h-full">
                {/* <h1 className="text-3xl font-bold text-center">{session.user.name}'s Calendar</h1> */}

                {/* <div className="flex flex-wrap min-w-screen">
                    <input type="text" placeholder="Add Title" style={{ width: "20%", marginRight: "10px" }} value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                </div> */}
                {/* <DatePicker placeholderText="Start Date" style={{ marginRight: "10px" }} selected={newEvent.start} onChange={(start) => setNewEvent({ ...newEvent, start })} />
                <DatePicker placeholderText="End Date" selected={newEvent.end} onChange={(end) => setNewEvent({ ...newEvent, end })} /> */}
                {/* <div className="flex flex-wrap flex-col min-w-screen">
                  <button style={{ marginTop: "10px" }} onClick={handleAddEvent}>
                      Add Event
                  </button>
                </div> */}

              <Calendar localizer={localizer} events={allEvents} startAccessor="start" endAccessor="end" style={{ height: 500, margin: "50px" }} />
            </div>
            
        </AppLayout>
    </>
  );
};

export default Page;
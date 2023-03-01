import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

const tasks: Task[] = [
    {
        start: new Date(2020, 1, 1),
        end: new Date(2020, 1, 2),
        name: 'Idea',
        id: 'Task 0',
        type:'task',
        progress: 45,
        isDisabled: true,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },
    {
        start: new Date(2020, 1, 7),
        end: new Date(2020, 1, 9),
        name: 'Proof of Concept',
        id: 'Task 1',
        type:'task',
        progress: 0,
        isDisabled: true,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },  
    },

]

const Page = () => {

    const { data: session } = useSession();
    const [allEvents, setAllEvents] = useState([]);
    const [technician, setTechnician] = useState([])
    const [technicianTasks, setTechnicianTasks] = useState<Task[]>([])


    // if session is not null, get user data
    useEffect(() => {
        if(session) getUser();
    }, [session]);


    useEffect(() => {
        if(technician) {
            const newTasks: Task[] = allEvents?.map((event) => {
                return {
                    start: new Date(event.start),
                    end: new Date(event.end),
                    name: event.title,
                    id: event._id,
                    type: 'task',
                    progress: 0,
                    isDisabled: true,
                    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
                }
            })
            setTechnicianTasks(newTasks)
        }
    }, [allEvents])

    const getUser = async() => {
        const result = await fetch('/api/get-user/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: session.user.email,
              
          }),
        })
    
        const data = await result.json()
        
        setTechnician(data)
        setAllEvents(data.calendar?.events)
    }




    console.log(technicianTasks)
    

    return (
        <>
            <AppLayout>
                {technicianTasks.length > 0 ?
                    <Gantt
                        tasks={technicianTasks}
                    />
                : null}
            </AppLayout>
        </>
    )
}

export default Page;
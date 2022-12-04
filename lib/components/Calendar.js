import { useState } from 'react';



const Calendar = () => {
    const [date, setDate] = useState(new Date())
   
    
    return (
        <div className='flex justify-center'>
            <h1 className=''>React Calendar</h1>
           
          
        </div>
    );
}

export default Calendar;
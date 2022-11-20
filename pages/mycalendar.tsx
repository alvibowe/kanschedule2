import AppLayout from "../lib/components/Layouts/AppLayout";
import { useSession } from "next-auth/react";
import React from "react";
import Flatpickr from "react-flatpickr";

const Page = () => {
  const { data: session } = useSession();
  const [date, setDate] = React.useState(new Date());

  console.log(date)
  return (
    <>
        <AppLayout>
            <div className="flex justify-center min-h-full">My Calendar</div>
            <Flatpickr
                data-enable-time
                value={date}
                onChange={([date]) => {setDate(date as Date)}}
            />
        </AppLayout>
    </>
  );
};

export default Page;
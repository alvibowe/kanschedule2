import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession } from "next-auth/react";
import Loader from "@lib/components/Loader";
import Calendar from "@lib/components/Calendar";

const Page = () => {
  const { status } = useSession({
    required: false,
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader/>
      </div>
    )
  }

  return (
    <>
      <AppLayout>
        {/* <Calendar /> */}
      </AppLayout>
    </>
  );
};

export default Page;

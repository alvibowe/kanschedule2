import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession } from "next-auth/react";
import Loader from "@lib/components/Loader";

const Page = () => {
  const { status } = useSession({
    required: false,
  });

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <>
      <AppLayout>
        <div>All current Runs/Add Runs</div>
      </AppLayout>
    </>
  );
};

export default Page;

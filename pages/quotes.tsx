import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession } from "next-auth/react";
import { getSession } from "@lib/auth/session";

const Page = () => {
  const { status, data: session } = useSession({
    required: false,
  });

  console.log(status, session);
  return (
    <>
      <AppLayout title="Quotes">
        <div>Current quotes/new quotes</div>
      </AppLayout>
    </>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}

export default Page;

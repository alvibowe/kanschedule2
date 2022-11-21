import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession, signIn } from "next-auth/react";
import { useQuery } from "react-query";
import superagent from "superagent";

const Page = () => {
  const { status, data: session } = useSession({
    required: false,
  });

  const withSessionQuery = useQuery(
    ["with-session-example", session],
    async () => {
      console.log(session);
      const data = await superagent.get("/api/with-session-example");

      return data.body.content;
    },
    {
      // The query will not execute until the session exists
      enabled: !!session,
    }
  );

  if (status === "loading") {
    return "Loading or not authenticated...";
  }

  console.log(withSessionQuery);
  if (!session) {
    return (
      <>
        <AppLayout title="With Session">
          <blockquote>
            <h1>Access Denied</h1>
            {/* <h1>
              <button type="button" onClick={() => signIn()}>
                <a>Login</a>&nbsp;
              </button>
              
            </h1> */}
          </blockquote>
        </AppLayout>
      </>
    );
  }

  return (
    <>
      <AppLayout >
        <div className="flex justify-center">
          <h1>Jobs</h1>
          
        </div>
      </AppLayout>
    </>
  );
};

export default Page;

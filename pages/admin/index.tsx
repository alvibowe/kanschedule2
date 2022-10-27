import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChevronRightIcon } from "@heroicons/react/solid";
import { GetServerSidePropsContext } from "next";
import classNames from "classnames";
import AdminLayout from "@lib/components/Layouts/AdminLayout";
import { getSession } from "@lib/auth/session";
import superagent from "superagent";
import prisma, { Prisma } from "@db";

const statusStyles = {
  true: "bg-green-100 text-green-800",
  false: "bg-gray-100 text-gray-800",
};

function Page() {
  const router = useRouter();
  const {
    status,
    data: { session },
  } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/", "/", {});
    },
  });

  if (status === "loading") {
    return "Loading or not authenticated...";
  }

  

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
    });
    return data.body;
  });

  if (usersQuery.isLoading) {
    return (
    <div className="flex justify-center items-center min-h-screen mt-5 text-xs">
        <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
          
        </svg>
    </div>
    );
  }

  return (
    <>
      <AdminLayout>
        {/* {/* Activity list (smallest breakpoint only) */}
        <div className="flex text-center justify-center "></div>

        <form className="flex justify-center flex-wrap md:m-40" onSubmit={(e) => {e.preventDefault()} }>
        
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
            First Name
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" required/>
          {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
            Last Name
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Doe" required/>
          {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
            Email
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="user@email.com" required/>
          {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
        </div>
        
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
            Role
          </label>
          <div className="relative">
            <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" required>
              <option>Admin</option>
              <option>System Manager</option>
              <option>Schedule Administrator</option>
              <option>Salesperson</option>
              <option>Technician</option>
              <option>Suspended</option>
            </select>
            {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div> */}
          </div>
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
            Company
          </label>
          <div className="relative">
            <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" required>
              <option>Kanschedule</option>
              
            </select>
            {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div> */}
          </div>
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <div className="w-full">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
              Password
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************" required/>
            <p className="text-gray-600 text-xs italic"></p>
          </div>
        </div>
        
        <button type="submit" className="button button__md button__primary mt-3 mb-4" >Add New User</button>

        </form>



        <div className=" sm:hidden">
          <ul
            role="list"
            className="mt-2 divide-y divide-gray-200 overflow-hidden  sm:hidden"
          >
            {usersQuery?.data &&
              usersQuery.data.map((user) => {
                return (
                  <li key={user.email}>
                    <a className="block px-4 py-4 bg-white hover:bg-gray-50">
                      <span className="flex items-center space-x-4">
                        <span className="flex-1 flex space-x-2 truncate">
                          <span className="flex flex-col text-gray-500 text-sm truncate">
                            <span className="truncate">{user.email}</span>
                            <span>{user.name}</span>
                            <span
                              className={classNames(
                                statusStyles[
                                  user.emailVerified ? "true" : "false"
                                ],
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                              )}
                            >
                              {user.emailVerified ? "Verified" : "Not Verified"}
                            </span>
                          </span>
                        </span>
                        <ChevronRightIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </li>
                );
              })}
          </ul>
        </div>

        {/* Activity table (small breakpoint and up) */}
        <div className="hidden sm:block">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col mt-2">
              <div className="align-middle min-w-full overflow-x-auto overflow-hidden flex justify-center">
                <table className="table-auto min-w-full">
                  <thead className="border rounded-md">
                    <tr className="border rounded-md">
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="hidden px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:block">
                        Status
                      </th>
                      {/* <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Providers
                      </th> */}
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white ">
                    {usersQuery?.data &&
                      usersQuery.data.map((user) => {
                        return (
                          <tr key={user.email} className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex">
                                <a className="group inline-flex space-x-2 truncate text-sm">
                                  <p className="text-gray-500 truncate group-hover:text-gray-900">
                                    {user.email}
                                  </p>
                                </a>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500 capitalize">
                              {user.name}
                            </td>
                            <td className="hidden px-6 py-4 whitespace-nowrap text-sm text-gray-500 md:block">
                              <span
                                className={classNames(
                                  statusStyles[
                                    user.emailVerified ? "true" : "false"
                                  ],
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                                )}
                              >
                                {user.emailVerified
                                  ? "Verified"
                                  : "Not Verified"}
                              </span>
                            </td>
                            {/* <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                              {user?.accounts && user?.accounts?.length > 0 ? (
                                user.accounts.map((account) => {
                                  return <p>{account.provider}</p>;
                                })
                              ) : (
                                <p>credentials</p>
                              )}
                            </td> */}
                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500 uppercase">
                              {user.role}
                            </td>
                            {/* {user?.company ?
                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500 uppercase">
                              {user.company}
                            </td >:
                            <p className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500 uppercase">Not Available</p>
                            } */}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

// Page.auth = true

export default Page;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || session?.user?.role !== "admin") {
    
   
    return { redirect: { permanent: false, destination: "/sign-in" } };
  }

  return {
    props: { session: session },
  };
}

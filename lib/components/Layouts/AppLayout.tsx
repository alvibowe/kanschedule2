import classNames from "classnames";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import { useRouter } from "next/router";

import Image from "next/image";


const AppLayout = (props) => {
  const { status, data: session  } = useSession({
    required: true,
  });

  const router = useRouter();

  const currentPath = router.pathname;
  const NAV_ITEMS = [
    {
      title: "Users",
      href: "/",
    },
    {
      title: "Runs",
      href: "/runs",
    },
    {
      title: "Quotes",
      href: "/quotes",
    },
    {
      title: "Jobs",
      href: "/jobs",
    },
    {
      title: "My Calendar",
      href: "/mycalendar",
    },
    {
      title: "My Gantt",
      href: "/mygantt",
    },
    {
      title: "My Map",
      href: "/mymap",
    },
    // {
    //   title: "Server Redirect",
    //   href: "/server-redirect",
    // },
  ];

 
  return (
    <>
      <div className="min-h-screen">
        <div className="flex flex-col flex-1">
          <div className="border-b">
            <div className=" bg-white">
              <div className="flex justify-between px-1 lg:px-7 pt-6">
                
                <div className="flex items-start">
                <Link href="/"><Image src={'/assets/KanLogo.png'} alt='Logo' height={90} width={280}/></Link>
                </div>
                <div className="flex items-center">
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="max-w-xs  bg-gray-100 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2 lg:rounded-full lg:hover:bg-gray-50">
                        {
                          <UserIcon className="h-6 w-6 rounded-full" />
                        }

                        <span className="hidden  text-gray-700 text-sm font-medium lg:block">
                          <span className="sr-only">Open user menu for </span>
                        </span>
                        <ChevronDownIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      
                      <Menu.Items className="origin-top-right absolute right-0 mt-4 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        {status == "authenticated" ? (
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={() => signOut()}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign Out
                              </a>
                            )}
                          </Menu.Item>
                        ) : (
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={() => signIn()}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign In
                              </a>
                            )}
                          </Menu.Item>
                        )}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
            <div className="relative flex-shrink-0 flex h-16 bg-white mt-6">
              <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
                <div className="flex flex-1 justify-between ">
                    {(session?.user as any)?.role === "technician" ?<Link key={"My Calendar"} href={"/mycalendar"}>
                          <a
                            className={classNames(
                              "/mycalendar" === currentPath
                                ? "border-b border-indigo-600 text-black"
                                : " hover:border-b  hover:border-gray-200 text-gray-600 ",
                              "group flex items-center px-2 py-2 text-sm leading-6 font-medium"
                            )}
                            aria-current={
                              "/mycalendar" === currentPath ? "page" : undefined
                            }
                          >
                            {"My Calendar"}
                          </a>
                    </Link>: null}
                    {(session?.user as any)?.role === "technician" ?<Link key={"My Gantt"} href={"/mygantt"}>
                          <a
                            className={classNames(
                              "/mygantt" === currentPath
                                ? "border-b border-indigo-600 text-black"
                                : " hover:border-b  hover:border-gray-200 text-gray-600 ",
                              "group flex items-center px-2 py-2 text-sm leading-6 font-medium"
                            )}
                            aria-current={
                              "/mygantt" === currentPath ? "page" : undefined
                            }
                          >
                            {"My Gantt"}
                          </a>
                    </Link>: null}

                    {(session?.user as any)?.role === "system manager" && <Link key={"Users"} href={"/"}>
                      <a
                        className={classNames(
                          "/" === currentPath
                            ? "border-b border-indigo-600 text-black"
                            : " hover:border-b  hover:border-gray-200 text-gray-600 ",
                          "group flex items-center px-2 py-2 text-sm leading-6 font-medium"
                        )}
                        aria-current={
                          "/" === currentPath ? "page" : undefined
                        }
                      >
                        {"Users"}
                      </a>
                    </Link>}
                    
                    {(session?.user as any)?.role !== "technician" && <Link key={"Quotes"} href={"/quotes"}>
                      <a
                        className={classNames(
                          "/quotes" === currentPath
                            ? "border-b border-indigo-600 text-black"
                            : " hover:border-b  hover:border-gray-200 text-gray-600 ",
                          "group flex items-center px-2 py-2 text-sm leading-6 font-medium"
                        )}
                        aria-current={
                          "/quotes" === currentPath ? "page" : undefined
                        }
                      >
                        {"Quotes"}
                      </a>
                    </Link>}
                    {(session?.user as any)?.role === "technician" && <Link key={"My Map"} href={"/mymap"}>
                      <a
                        className={classNames(
                          "/mymap" === currentPath
                            ? "border-b border-indigo-600 text-black"
                            : " hover:border-b  hover:border-gray-200 text-gray-600 ",
                          "group flex items-center px-2 py-2 text-sm leading-6 font-medium"
                        )}
                        aria-current={
                          "/mymap" === currentPath ? "page" : undefined
                        }
                      >
                        {"My Map"}
                      </a>
                    </Link>}
                    {(session?.user as any)?.role !== "technician" && <Link key={"Jobs"} href={"/jobs"}>
                      <a
                        className={classNames(
                          "/jobs" === currentPath
                            ? "border-b border-indigo-600 text-black"
                            : " hover:border-b  hover:border-gray-200 text-gray-600 ",
                          "group flex items-center px-2 py-2 text-sm leading-6 font-medium"
                        )}
                        aria-current={
                          "/jobs" === currentPath ? "page" : undefined
                        }
                      >
                        {"Jobs"}
                      </a>
                    </Link>}
                    {(session?.user as any)?.role === "system manager" ? <Link key={"Runs"} href={"/runs"}>
                      <a
                        className={classNames(
                          "/runs" === currentPath
                            ? "border-b border-indigo-600 text-black"
                            : " hover:border-b  hover:border-gray-200 text-gray-600 ",
                          "group flex items-center px-2 py-2 text-sm leading-6 font-medium"
                        )}
                        aria-current={
                          "/runs" === currentPath ? "page" : undefined
                        }
                      >
                        {"Runs"}
                      </a>
                    </Link> : <></>}
                    
                  {/* {NAV_ITEMS.map((item) => (
                    <Link key={item.title} href={item.href}>
                      <a
                        className={classNames(
                          item.href === currentPath
                            ? "border-b border-indigo-600 text-black"
                            : " hover:border-b  hover:border-gray-200 text-gray-600 ",
                          "group flex items-center px-2 py-2 text-sm leading-6 font-medium"
                        )}
                        aria-current={
                          item.href === currentPath ? "page" : undefined
                        }
                      >
                        {item.title}
                      </a>
                    </Link>
                  ))} */}
                </div>
              </div>
            </div>
          </div>
          <main className="flex-1 pb-8">
            <div className="bg-white ">
              <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
                <div className="pt-6 pb-2 md:flex md:items-center md:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <div>
                        <div className="flex items-center">
                          <h1 className="text-xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                            {props.title}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {props.children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
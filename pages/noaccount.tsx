
import classNames from "classnames";
import { useSession, signOut, signIn } from "next-auth/react";

import { Menu, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment } from "react";


const Page = () => {
    const { status, data: session } = useSession({required: true,})

    
    return (
    <>
        <div className="grid min-h-screen">
             <div className="relative flex-shrink-0 flex h-16 bg-white">
              <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
                
                <div className="flex-1 flex"></div>
                <div className="ml-4 flex items-center md:ml-6">
                  <Menu as="div" className="ml-3  relative">
                    <div>
                      <Menu.Button className="max-w-xs  bg-gray-100 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2 lg:rounded-md lg:hover:bg-gray-50">
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
                                Back to Sign In
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
            <div className="flex justify-center font-bold text-base">
                <div>
                    Your account with Kanschedule is not enabled or has expired .
                    Kindly contact the admin for more information.
                </div>
               
            </div>
        </div>
        
    </>
  );
};

export default Page;
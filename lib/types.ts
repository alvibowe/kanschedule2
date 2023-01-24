import { AppProps } from "next/app";
import { Component } from "react";
import { DefaultUser } from 'next-auth';


export type AuthenticatedPage = {
  role?: string;
  redirectTo?: string; // redirect to this url
};
export type ExtendedPageProps = {
  requiresAuth?: boolean
  auth?: AuthenticatedPage;
  layout?: Component;
};

export type ExtendedAppProps = AppProps & {
  Component: ExtendedPageProps;
};

declare module 'next-auth' {
  interface Session {
      user?: DefaultUser & { id: string; role: string };
  }
  interface User extends DefaultUser {
      role: string;
  }
}



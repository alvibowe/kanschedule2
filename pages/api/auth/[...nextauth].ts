import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verifyPassword, hashPassword } from "@lib/auth/passwords";
import { Session } from "@lib/auth/session";
import prisma from "@db/index";
import { CredentialsProvider } from "next-auth/providers";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: 'secret'
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    // signOut: "/auth/logout",
    // error: "/auth/error", // Error code passed in query string as ?error=
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "app-login",
      name: "App Login",
      credentials: {
        email: { label: "Email Address", type: "email", placeholder: "john.doe@example.com" },
        password: { label: "Password", type: "password", placeholder: "Your super secure password" },
      },
      async authorize(credentials) {
        try {
          let user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true,
            },
          });

          if (!user) {
            if (!credentials.password || !credentials.email) {
              throw new Error("Invalid Credentials");
            }

            user = await prisma.user.create({
              data: {
                email: credentials.email,
                password: await hashPassword(credentials.password),
              },
              select: {
                id: true,
                email: true,
                password: true,
                name: true,
                role: true,
              },
            });
          } else {
            const isValid = await verifyPassword(credentials.password, user.password);

            if (!isValid) {
              throw new Error("Invalid Credentials");
            }
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
    CredentialsProvider({
      id: "admin-login",
      name: "Administrator Login",
      credentials: {
        email: { label: "Email Address", type: "email", placeholder: "john.doe@example.com" },
        password: { label: "Password", type: "password", placeholder: "Your super secure password" },
      },
      async authorize(credentials) {
        let user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: true,
          },
        });

        if (!user) {
          throw new Error("Unauthorized.");
        }

        if (user.role !== "admin") {
          throw new Error("Unauthorized.");
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid Credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true

    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        
        token.id = user.id;
        token.role = user.role;
        
      }

      return token;
    },
    async session({ session, token, user }) {
      const sess: Session = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as unknown as string,
        },
      };

      return sess;
    },
  },
});

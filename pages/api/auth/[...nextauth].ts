import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord"

const prisma = new PrismaClient()

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user)
      return token
    },
    async session({ session, user }: any) {
      session = {
        ...session,
        user: {
          id: user.id,
          ...session.user,
        },
      }
      return session
    },
  },
  events: {
    async signIn(message) {
      if (message.isNewUser) {
        // create eneftiland demo collection
        const collection: any = await prisma.collection.findUnique({
          where: { id: "eneftiland-demo" },
        })

        if (collection) {
          delete collection.id
          delete collection.dateCreated

          const newCollection = await prisma.collection.create({
            data: {
              ...collection,
              userId: message.user.id,
            },
          })

          // create share collection
          await prisma.collectionshare.create({
            data: {
              collectionId: newCollection.id,
            },
          })
        }
      }
    },
  },
})

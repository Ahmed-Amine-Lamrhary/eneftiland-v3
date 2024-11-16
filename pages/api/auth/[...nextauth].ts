import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { DEMO_LAYERS, DEMO_RESULTS } from "../../../helpers/constants"

const prisma = new PrismaClient()

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
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
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token
    },
    async session({ session, token }: any) {    
      session = {
        ...session,
        user: {
          id: token.user.id,
          lifetime: token.user.lifetime,
          ...session.user,
        },
      }
      return session
    },
  },
  events: {
    async signIn(message) {
      if (message.isNewUser) {
        const newCollection = await prisma.collection.create({
          data: {
            userId: message.user.id,
            layers: DEMO_LAYERS,
            galleryLayers: DEMO_LAYERS,
            results: DEMO_RESULTS,
            collectionDesc: "Eneftiland",
            collectionName: "Eneftiland Demo",
            collectionSize: 100,
            creators: "[]",
            externalUrl: "",
            network: "eth",
            prefix: "",
            royalties: 0,
            symbol: "",
            size: 500,
          },
        })

        // create share collection
        await prisma.collectionshare.create({
          data: {
            collectionId: newCollection.id,
          },
        })
      }
    },
  },
})

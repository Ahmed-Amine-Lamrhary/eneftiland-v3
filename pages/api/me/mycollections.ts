import { parseCollection } from "../../../services/parser"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import authOptions from '../auth/[...nextauth]'

const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    const session: any = await getServerSession(req, res, authOptions);

    if (!session)
      return res.json({
        success: false,
        message: "Not authorized",
      })

    const { page = 1, query } = req.body

    const limit = 11

    const collections = await prisma.collection.findMany({
      where: {
        userId: session.user.id,
        collectionName: {
          contains: query,
        },
        isHistory: false,
      },
      orderBy: {
        dateCreated: "desc",
      },
      skip: limit * (page - 1),
      take: limit,
    })

    const count = await prisma.collection.count({
      where: {
        userId: session.user.id,
        isHistory: false,
      },
    })

    const collectionsData = collections.map((c: any) => parseCollection(c))

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: collectionsData,
      count,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

import { parseCollection } from "../../../services/parser"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import authOptions from '../auth/[...nextauth]'
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    const session: any = await getServerSession(req, res, authOptions)

    if (!session)
      return res.json({
        success: false,
        message: "Not authorized",
      })

    const { page = 1, query } = req.body

    const limit = 11

    const collaborations = await prisma.collaborations.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        collection: true,
      },
      orderBy: {
        dateCreated: "desc",
      },
      skip: limit * (page - 1),
      take: limit,
    })

    const count = await prisma.collaborations.count({
      where: {
        userId: session.user.id,
      },
    })

    const collectionsData = collaborations.map((c: any) =>
      parseCollection(c.collection)
    )

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

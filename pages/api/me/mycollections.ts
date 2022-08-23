import { parseCollection } from "../../../services/parser"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    const { page = 1, query, address } = req.body

    // if (!address)
    //   return res.json({
    //     success: false,
    //     message: "Not authorized",
    //   })

    const user: any = await prisma.user.findFirst({
      where: {
        metamaskAddress: address,
      },
    })

    const limit = 11

    const collections = await prisma.collection.findMany({
      where: {
        userId: user.id,
        collectionName: {
          contains: query,
        },
      },
      orderBy: {
        dateCreated: "desc",
      },
      skip: limit * (page - 1),
      take: limit,
    })

    const count = await prisma.collection.count({
      where: {
        userId: user.id,
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

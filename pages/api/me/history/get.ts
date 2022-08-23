import { parseCollection } from "../../../../services/parser"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    const { id, address } = req.body

    // if (!address)
    //   return res.json({
    //     success: false,
    //     message: "Not authorized",
    //   })

    const history = await prisma.history.findMany({
      where: {
        collectionId: id,
      },
      orderBy: {
        dateCreated: "desc",
      },
    })

    const historyData = history.map((h: any) => ({
      ...parseCollection(h),
    }))

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: historyData,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

import { parseCollection } from "../../../services/parser"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    const { page = 1, id, address } = req.body

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

    const collection = await prisma.collection.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    const collectionData = parseCollection(collection)

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: collectionData,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

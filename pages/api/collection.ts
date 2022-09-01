import { parseCollection } from "../../services/parser"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    const { id } = req.body

    const collection = await prisma.collection.findFirst({
      where: {
        id,
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

import { parseCollection } from "../../../services/parser"
import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/react"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    const session: any = await getSession({ req })

    if (!session)
      return res.json({
        success: false,
        message: "Not authorized",
      })

    const { id } = req.body

    const collection = await prisma.collection.findFirst({
      where: {
        id,
        userId: session.user.id,
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

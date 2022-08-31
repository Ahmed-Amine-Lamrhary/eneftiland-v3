import { PrismaClient } from "@prisma/client"
import { startCreating } from "../../helpers/generator"
const prisma = new PrismaClient()
import { getSession } from "next-auth/react"

const ioHandler = async (req: any, res: any) => {
  try {
    const session: any = await getSession({ req })

    if (!session)
      return res.json({
        success: false,
        message: "Not authorized",
      })

    const { collection } = req.body

    const rules = await prisma.rule.findMany({
      where: {
        collectionId: collection.id,
      },
    })

    const { success, data, error } = await startCreating(rules, collection)

    if (!success) return res.json({ success: false, message: error })

    res.json({
      success: true,
      data,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

export const config = {
  api: {
    api: {
      responseLimit: "8mb",
    },
  },
}

export default ioHandler

import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import authOptions from '../auth/[...nextauth]'
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  const session: any = await getServerSession(req, res, authOptions)

  if (!session)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  const { collectionId, rule } = req.body

  try {
    const newRule = await prisma.rule.create({
      data: {
        collectionId: collectionId,
        ...rule,
      },
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: {
        newRule,
      },
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

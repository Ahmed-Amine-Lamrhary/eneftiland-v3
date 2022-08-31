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

    const { page = 1 } = req.body
    const limit = 10

    const count = await prisma.transaction.count({
      where: {
        userId: session.user.id,
      },
    })

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        dateCreated: "desc",
      },
      skip: limit * (page - 1),
      take: limit,
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: transactions,
      count,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { getSession } from "next-auth/react"

export default async (req: any, res: any) => {
  try {
    const session: any = await getSession({ req })

    if (!session)
      return res.json({
        success: false,
        message: "Not authorized",
      })

    const { label, amount, method, currency } = req.body

    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        label,
        amount,
        method,
        currency,
      },
    })

    const transactions = await prisma.transaction.findMany({
      orderBy: {
        dateCreated: "asc",
      },
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: transactions,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

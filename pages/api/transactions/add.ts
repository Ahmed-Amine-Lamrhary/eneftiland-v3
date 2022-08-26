import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import jwt from "jsonwebtoken"

export default async (req: any, res: any) => {
  try {
    // jwt verification
    const token = req.headers.authorization
    if (!token)
      return res.json({
        success: false,
        message: "Not authorized",
      })

    try {
      jwt.verify(token, "secret")
    } catch (err) {
      return res.json({
        success: false,
        message: "Not authorized",
      })
    }
    // jwt verification

    const { address, label, amount, method, currency } = req.body

    const user: any = await prisma.user.findFirst({
      where: {
        metamaskAddress: address,
      },
    })

    await prisma.transaction.create({
      data: {
        userId: user?.id,
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

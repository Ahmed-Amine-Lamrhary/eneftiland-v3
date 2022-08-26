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

    const { address } = req.body

    const user: any = await prisma.user.findFirst({
      where: {
        metamaskAddress: address,
      },
    })

    const { page = 1 } = req.body
    const limit = 10

    const count = await prisma.transaction.count({
      where: {
        userId: user.id,
      },
    })

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
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

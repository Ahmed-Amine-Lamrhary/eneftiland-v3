import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    const { id } = req.body

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

    const history = await prisma.history.findMany({
      where: {
        collectionId: id,
      },
      orderBy: {
        dateCreated: "desc",
      },
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: history,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

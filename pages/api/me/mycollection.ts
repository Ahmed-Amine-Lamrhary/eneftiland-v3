import { parseCollection } from "../../../services/parser"
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

    const { page = 1, id, address } = req.body

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

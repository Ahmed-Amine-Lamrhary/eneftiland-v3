import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import jwt from "jsonwebtoken"

export default async (req: any, res: any) => {
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

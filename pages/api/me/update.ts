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

  const { address } = req.body

  const user: any = await prisma.user.findFirst({
    where: {
      metamaskAddress: address,
    },
  })

  const { name, email } = req.body

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        email,
      },
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: updatedUser,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

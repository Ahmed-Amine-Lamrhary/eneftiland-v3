import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    const { address } = req.body

    if (!address)
      return res.json({
        success: false,
        message: "Address is required",
      })

    // check if user exists
    const user: any = await prisma.user.findFirst({
      where: {
        metamaskAddress: address,
      },
    })

    if (!user) {
      await prisma.user.create({
        data: {
          metamaskAddress: address,
        },
      })
    }

    // jwt
    const token = jwt.sign(user, "secret")

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: {
        user,
        token,
      },
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import authOptions from '../auth/[...nextauth]'
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    const session: any = await getServerSession(req, res, authOptions)

    if (!session)
      return res.json({
        success: false,
        message: "Not authorized",
      })

    const { email } = req.body

    const users = email
      ? await prisma.user.findMany({
          where: {
            id: {
              not: session.user.id,
            },
            email: {
              startsWith: email,
            },
          },
        })
      : []

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: users,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

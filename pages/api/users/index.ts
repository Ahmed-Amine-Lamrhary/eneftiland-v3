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

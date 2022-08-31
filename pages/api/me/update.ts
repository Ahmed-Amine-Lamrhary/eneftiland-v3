import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/react"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  const session: any = await getSession({ req })

  if (!session)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  const { name, email } = req.body

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
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

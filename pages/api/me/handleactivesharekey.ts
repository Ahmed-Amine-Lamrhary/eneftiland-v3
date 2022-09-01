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

  try {
    const { key, isActive } = req.body

    await prisma.collectionshare.update({
      where: {
        id: key,
      },
      data: {
        isActive,
      },
    })

    res.json({
      success: true,
      message: `Key is ${isActive ? " activated" : " deactivated"}`,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

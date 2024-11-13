import { PrismaClient } from "@prisma/client"
import { formatRFC3339 } from "date-fns"
import { getServerSession } from "next-auth/next"
import authOptions from '../auth/[...nextauth]'
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  const session: any = await getServerSession(req, res, authOptions)

  if (!session)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  try {
    if (session.user.lifetime)
      return res.json({
        success: false,
        message: "Lifetime deal is already activated",
      })

    const { code } = req.body

    const redumption = await prisma.redumption.findFirst({
      where: {
        id: code,
        isActive: true,
      },
    })

    if (!redumption)
      return res.json({
        success: false,
        message: "Redumption code doesn't exist",
      })

    if (redumption.useDate)
      return res.json({
        success: false,
        message: "Redumption code is already used",
      })

    // redumption code is valid
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        lifetime: true,
      },
    })

    await prisma.redumption.update({
      where: {
        id: code,
      },
      data: {
        useDate: formatRFC3339(new Date()),
        userId: session.user.id,
      },
    })

    res.json({
      success: true,
      message: "Lifetime deal is activated",
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

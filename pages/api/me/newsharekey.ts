import { PrismaClient } from "@prisma/client"
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
    const { id } = req.body

    // delete old one
    await prisma.collectionshare.deleteMany({
      where: {
        collectionId: id,
        forAdmin: false,
      },
    })

    // create share collection
    const collectionshare = await prisma.collectionshare.create({
      data: {
        collectionId: id,
        isActive: true,
      },
    })

    res.json({
      success: true,
      message: "New key created",
      data: {
        id: collectionshare.id,
      },
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

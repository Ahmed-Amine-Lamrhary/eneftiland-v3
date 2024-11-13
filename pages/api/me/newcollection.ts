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
    const collection = await prisma.collection.create({
      data: {
        userId: session.user.id,
        collectionName: "Without name",
        collectionDesc: "Without description",
        collectionSize: 1,
        symbol: "",
        size: 500,
        network: "eth",
        externalUrl: "",
        prefix: "",
        creators: "",
        royalties: 0,

        layers: "",
        galleryLayers: "",
        results: "",
      },
    })

    // create share collection
    await prisma.collectionshare.create({
      data: {
        collectionId: collection.id,
      },
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: {
        id: collection.id,
      },
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

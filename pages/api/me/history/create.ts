import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import authOptions from '../../auth/[...nextauth]'

const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  const session: any = await getServerSession(req, res, authOptions)

  if (!session)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  const { collectionId } = req.body

  try {
    // create new collection
    const collection: any = await prisma.collection.findUnique({
      where: { id: collectionId },
    })

    delete collection.id
    delete collection.dateCreated

    const history = await prisma.collection.create({
      data: {
        ...collection,
        collectionId,
        isHistory: true,
        galleryLayers: "",
      },
    })

    return res.json({
      success: true,
      message: "Operation was done successfully",
      data: history,
    })
  } catch (error: any) {
    console.log(error)
    res.json({
      success: false,
      message: error.message,
    })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
}

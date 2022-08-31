import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { getSession } from "next-auth/react"
import { parseCollection } from "../../../services/parser"

const ioHandler = async (req: any, res: any) => {
  const session: any = await getSession({ req })

  if (!session)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  const { id, layers } = req.body

  try {
    const collection = parseCollection(
      await prisma.collection.findFirst({
        where: {
          id,
        },
      })
    )

    await prisma.collection.updateMany({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        layers: JSON.stringify(layers),
        ...((!collection?.layers || collection.layers.length === 0) && {
          galleryLayers: JSON.stringify(layers),
        }),
      },
    })

    res.json({
      success: true,
      message: "Layers were updated successfully",
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
}

export default ioHandler

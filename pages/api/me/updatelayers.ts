import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import jwt from "jsonwebtoken"
import { parseCollection } from "../../../services/parser"

const ioHandler = async (req: any, res: any) => {
  // jwt verification
  const token = req.headers.authorization
  if (!token)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  try {
    jwt.verify(token, "secret")
  } catch (err) {
    return res.json({
      success: false,
      message: "Not authorized",
    })
  }
  // jwt verification

  const { id, layers } = req.body

  try {
    const collection = parseCollection(
      await prisma.collection.findFirst({
        where: {
          id,
        },
      })
    )

    await prisma.collection.update({
      where: {
        id,
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

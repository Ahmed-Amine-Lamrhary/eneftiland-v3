import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import jwt from "jsonwebtoken"

export default async (req: any, res: any) => {
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

  const { address } = req.body

  const user: any = await prisma.user.findFirst({
    where: {
      metamaskAddress: address,
    },
  })

  try {
    const collection = await prisma.collection.create({
      data: {
        userId: user.id,
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

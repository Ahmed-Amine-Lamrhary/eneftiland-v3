import { parseCollection } from "../../../../services/parser"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

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

  const { collectionId } = req.body

  try {
    const collectionData: any = await prisma.collection.findUnique({
      where: { id: collectionId },
    })
    const collection = parseCollection(collectionData)

    // add to history
    const history = await prisma.history.create({
      data: {
        collectionId,
        ipfsGateway: "",
        imagesCid: "",
        metaCid: "",
        collectionSize: collection.results.length,
        layers: collectionData.layers,
        results: collectionData.results,
        completed: false,

        collectionDesc: collectionData.collectionDesc,
        collectionName: collectionData.collectionName,
        creators: collectionData.creators,
        externalUrl: collectionData.externalUrl,
        network: collectionData.network,
        prefix: collectionData.prefix,
        royalties: collectionData.royalties,
        symbol: collectionData.symbol,
        size: collectionData.size,
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

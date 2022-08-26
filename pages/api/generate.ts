import { PrismaClient } from "@prisma/client"
import { startCreating } from "../../helpers/generator"
const prisma = new PrismaClient()
import jwt from "jsonwebtoken"

const ioHandler = async (req: any, res: any) => {
  try {
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

    const { collection } = req.body

    const {
      id,
      layers,
      collectionDesc,
      collectionName,
      collectionSize,
      creators,
      externalUrl,
      network,
      prefix,
      royalties,
      symbol,
    } = collection

    const metadata = {
      symbol,
      seller_fee_basis_points: royalties,
      external_url: externalUrl,
      creators,
    }

    const layerConfigurations = [
      {
        growEditionSizeTo: collectionSize,
        layersOrder: layers
          .slice()
          .reverse()
          .filter((l: any) => l.images.length > 0),
      },
    ]

    const rules = await prisma.rule.findMany({
      where: {
        collectionId: id,
      },
    })

    const { success, data, error } = await startCreating(id, rules, {
      layerConfigurations,
      namePrefix: prefix ? prefix : collectionName,
      description: collectionDesc,
      network,
      metadata,
    })

    if (!success) return res.json({ success: false, message: error })

    res.json({
      success: true,
      data,
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

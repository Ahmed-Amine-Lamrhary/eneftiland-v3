import { parseCollection, parseHistory } from "../../../../services/parser"
import { PrismaClient } from "@prisma/client"
import { NFTStorage } from "nft.storage"
import { packToBlob } from "ipfs-car/pack/blob"
import { MemoryBlockStore } from "ipfs-car/blockstore/memory"
import { getLayersImages, getMetadata } from "../../../../helpers/utils"
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

  const { id } = req.query

  try {
    // get data
    const currentHistory = await prisma.history.findUnique({
      where: { id },
    })
    const historyCollection = parseHistory(currentHistory)
    const currentCollectionData = await prisma.collection.findUnique({
      where: { id: currentHistory?.collectionId },
    })
    const currentCollection = parseCollection(currentCollectionData)

    // start re-generating
    const metas: any = []

    historyCollection.results.forEach(async (item: any, i: number) => {
      // metadata
      const { metadata } = getMetadata(currentCollection, item, i)
      metas.push(metadata)
    })

    // upload to IPFS
    const client = new NFTStorage({
      token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || "",
    })

    // metadata
    metas.forEach((meta: any) => {
      meta.image = meta.image.replace("<CID>", currentHistory?.imagesCid)
    })

    const { car: metasCar } = await packToBlob({
      input: [
        ...metas.map((meta: any, index: number) => ({
          path: `${index + 1}.json`,
          content: Buffer.from(JSON.stringify(meta)),
        })),
        {
          path: "_metadata.json",
          content: Buffer.from(JSON.stringify(metas)),
        },
      ],
      blockstore: new MemoryBlockStore(),
    })

    const metasCid = await client.storeCar(metasCar)

    // add to history
    await prisma.history.update({
      where: {
        id,
      },
      data: {
        metaCid: metasCid,
      },
    })

    return res.json({
      success: true,
      message: "Operation was done successfully",
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

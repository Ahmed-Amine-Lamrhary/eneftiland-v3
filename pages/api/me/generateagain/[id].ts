import { createCanvas } from "canvas"
import { parseHistory } from "../../../../services/parser"
import { PrismaClient } from "@prisma/client"
import { NFTStorage } from "nft.storage"
import { packToBlob } from "ipfs-car/pack/blob"
import { MemoryBlockStore } from "ipfs-car/blockstore/memory"
import {
  getLayersImagesFromHistory,
  getMetadata,
} from "../../../../helpers/utils"
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

  const { id: historyId } = req.query

  try {
    const historyData = await prisma.history.findUnique({
      where: { id: historyId },
    })

    const history = parseHistory(historyData)

    const size = history.size

    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext("2d")

    const allLayersImages = await getLayersImagesFromHistory({
      history,
    })

    const nfts: any = []
    const metas: any = []

    await Promise.all(
      history.results.map(async (item: any, i: number) => {
        // metadata
        const { metadata, edition } = getMetadata(history, item, i)
        metas.push(metadata)

        // image
        const loadedImages: any = []

        item?.attributes.forEach((attr: any) => {
          const f = allLayersImages.find((u: any) => u.id === attr.id)
          loadedImages.push(f.file)
        })

        //////////////////// creating nft /////////////////////
        loadedImages.forEach((img: any) => {
          ctx.drawImage(img, 0, 0, size, size)
        })

        const imageName = `${edition}.png`
        const canvasType: any = "image/png"
        const img = canvas.toBuffer(canvasType)
        //////////////////// creating nft /////////////////////

        nfts.push({
          data: img,
          name: imageName,
          index: i,
        })

        ctx.clearRect(0, 0, size, size)
        ctx.beginPath()
      })
    )

    // upload to IPFS
    const ipfsGateway = "https://nftstorage.link/ipfs"
    const client = new NFTStorage({
      token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || "",
    })

    // images
    nfts.sort((a: any, b: any) => a.index - b.index)

    const { car: nftsCar } = await packToBlob({
      input: [
        ...nfts.map((nft: any) => ({
          path: nft.name,
          content: nft.data,
        })),
      ],
      blockstore: new MemoryBlockStore(),
    })

    const nftsCid = await client.storeCar(nftsCar)

    // metadata
    metas.forEach((meta: any) => {
      meta.image = meta.image.replace("<CID>", nftsCid)
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
        id: historyId,
      },
      data: {
        ipfsGateway,
        imagesCid: nftsCid,
        metaCid: metasCid,
        completed: true,
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

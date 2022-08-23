import { createCanvas, loadImage } from "canvas"
import { parseCollection } from "../../../../services/parser"
import { PrismaClient } from "@prisma/client"
import { NFTStorage } from "nft.storage"
import { packToBlob } from "ipfs-car/pack/blob"
import { MemoryBlockStore } from "ipfs-car/blockstore/memory"
import { getLayersImages, getMetadata } from "../../../../helpers/utils"

const prisma = new PrismaClient()

const getWatermarkCred = ({ size, position }: any) => {
  const watermarkSize = size / 4

  let x,
    y,
    w = watermarkSize,
    h = watermarkSize

  switch (position) {
    case "top-left":
      x = 0
      y = 0
      break
    case "top-right":
      x = size - watermarkSize
      y = 0
      break
    case "bottom-left":
      x = 0
      y = size - watermarkSize
      break
    case "bottom-right":
      x = size - watermarkSize
      y = size - watermarkSize
      break
    case "center":
      x = size / 2 - watermarkSize / 2
      y = size / 2 - watermarkSize / 2
      break
    case "full":
      x = 0
      y = 0
      w = size
      h = size
      break
  }

  return { x, y, w, h }
}

export default async (req: any, res: any) => {
  const { watermark, ipfsProvider } = req.body

  const { id } = req.query

  try {
    const collectionData: any = await prisma.collection.findUnique({
      where: { id },
    })
    const collection = parseCollection(collectionData)

    const size = collection.size

    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext("2d")

    const allLayersImages = await getLayersImages({
      collection,
    })

    // watermark
    const settings = await prisma.settings.findFirst()
    const watermarkUrl = settings?.watermarkUrl
    const watermarkImg = watermarkUrl ? await loadImage(watermarkUrl) : null
    // watermark

    const nfts: any = []
    const metas: any = []

    await Promise.all(
      collection.results.map(async (item: any, i: number) => {
        // metadata
        const { metadata, edition } = getMetadata(
          collection,
          allLayersImages,
          item,
          i
        )
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

        if (watermark && watermarkImg) {
          const { x, y, w, h } = getWatermarkCred({
            size,
            position: settings?.watermarkPos,
          })

          ctx.drawImage(watermarkImg, x, y, w, h)
        }
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
        ...metas.map((meta: any) => ({
          path: meta.filename,
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
    await prisma.history.create({
      data: {
        collectionId: id,
        ipfsGateway,
        imagesCid: nftsCid,
        metaCid: metasCid,
        collectionSize: collection.results.length,
        layers: collectionData.layers,
        results: collectionData.results,
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

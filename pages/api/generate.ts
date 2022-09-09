import { PrismaClient } from "@prisma/client"
import { startCreating } from "../../helpers/generator"
const prisma = new PrismaClient()
import { getSession } from "next-auth/react"
import { parseCollection, parseResults } from "../../services/parser"

const ioHandler = async (req: any, res: any) => {  
  try {
    const session: any = await getSession({ req })

    if (!session)
      return res.json({
        success: false,
        message: "Not authorized",
      })

    const { collectionId } = req.body

    const collection = parseCollection(
      await prisma.collection.findFirst({
        where: {
          id: collectionId,
        },
      })
    )

    const rules = await prisma.rule.findMany({
      where: {
        collectionId,
      },
    })

    const { success, data, error } = await startCreating(rules, collection)

    if (!success) return res.json({ success: false, message: error })

    const resultsString = data?.metadata
      .map((i: any) => {
        const attrs = i.attributes.map((a: any) => {
          const layer = collection?.layers?.find(
            (l: any) => l.name === a.trait_type
          )
          const layerIndex = collection?.layers?.findIndex(
            (l: any) => l.name === a.trait_type
          )

          const imageIndex = layer?.images?.findIndex(
            (img: any) => img.name === a.value
          )

          return `${layerIndex}+${imageIndex}`
        })

        return attrs.join(",")
      })
      .join("|")

    const results = parseResults(collection, resultsString, true)

    // update results
    await prisma.collection.updateMany({
      where: {
        id: collectionId,
        userId: session.user.id,
      },
      data: {
        results: resultsString,
        galleryLayers: JSON.stringify(collection?.layers),
      },
    })

    res.json({
      success: true,
      data: {
        ...data,
        metadata: results,
      },
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

export const config = {
  api: {
    api: {
      responseLimit: "8mb",
    },
  },
}

export default ioHandler

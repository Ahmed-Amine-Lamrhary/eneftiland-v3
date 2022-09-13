import { PrismaClient } from "@prisma/client"
import { startCreating } from "../../helpers/generator"
const prisma = new PrismaClient()
import { getSession } from "next-auth/react"
import { parseCollection } from "../../services/parser"

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

    // calculate rarity score
    // data?.map((item: any) => {
    //   const sum = item.attributes.reduce((currentSum: any, attr: any) => {
    //     const total = data.filter((r: any) =>
    //       r.attributes.some((a: any) => a.id === attr.id)
    //     ).length

    //     return currentSum + total
    //   }, 0)

    //   item["totalRarity"] = sum
    // })
    // calculate rarity score

    const resultsString = data
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

        attrs.push(i.totalRarity)

        return attrs.join(",")
      })
      .join("|")

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
      data,
    })
  } catch (error: any) {
    console.log(error)
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

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    // const { address } = req.body

    // if (!address)
    //   return res.json({
    //     success: false,
    //     message: "Not authorized",
    //   })

    const { collectionId, page = 1 } = req.body
    const limit = 10

    const rules = await prisma.rule.findMany({
      where: {
        collectionId,
      },
      skip: limit * (page - 1),
      take: limit,
    })

    const count = await prisma.rule.count({
      where: {
        collectionId,
      },
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: rules,
      count,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

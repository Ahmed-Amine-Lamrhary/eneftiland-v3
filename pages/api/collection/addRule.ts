import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  // const { address } = req.body

  // if (!address)
  //   return res.json({
  //     success: false,
  //     message: "Not authorized",
  //   })

  const { collectionId, rule } = req.body

  try {
    const newRule = await prisma.rule.create({
      data: {
        collectionId: collectionId,
        ...rule,
      },
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: {
        newRule,
      },
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

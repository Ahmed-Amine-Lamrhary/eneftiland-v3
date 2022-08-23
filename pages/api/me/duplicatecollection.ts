import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  const { id, address } = req.body

  // if (!address)
  //   return res.json({
  //     success: false,
  //     message: "Not authorized",
  //   })

  try {
    // create new collection
    const collection: any = await prisma.collection.findUnique({
      where: { id },
    })

    delete collection.id
    delete collection.dateCreated

    await prisma.collection.create({
      data: {
        ...collection,
      },
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

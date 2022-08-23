import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const ioHandler = async (req: any, res: any) => {
  // const { address } = req.body

  // if (!address)
  //   return res.json({
  //     success: false,
  //     message: "Not authorized",
  //   })

  const { id, currentCollection } = req.body

  try {
    await prisma.collection.update({
      where: {
        id,
      },
      data: {
        ...currentCollection,
      },
    })

    res.json({
      success: true,
      message: "Collection was updated successfully",
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

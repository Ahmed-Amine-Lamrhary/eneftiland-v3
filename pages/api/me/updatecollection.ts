import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/react"
const prisma = new PrismaClient()

const ioHandler = async (req: any, res: any) => {
  const session: any = await getSession({ req })

  if (!session)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  const { id, currentCollection } = req.body

  try {
    await prisma.collection.updateMany({
      where: {
        id,
        userId: session.user.id,
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

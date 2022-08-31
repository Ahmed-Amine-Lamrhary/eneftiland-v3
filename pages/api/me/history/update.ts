import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/react"

const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  const session: any = await getSession({ req })

  if (!session)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  const { id } = req.body

  try {
    // update
    await prisma.collection.update({
      where: {
        id,
      },
      data: {
        ...req.body,
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

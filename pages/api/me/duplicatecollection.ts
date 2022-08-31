import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { getSession } from "next-auth/react"

export default async (req: any, res: any) => {
  const session: any = await getSession({ req })

  if (!session)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  const { id } = req.body

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

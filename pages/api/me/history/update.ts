import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  // jwt verification
  const token = req.headers.authorization
  if (!token)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  try {
    jwt.verify(token, "secret")
  } catch (err) {
    return res.json({
      success: false,
      message: "Not authorized",
    })
  }
  // jwt verification

  const { id, ipfsGateway, imagesCid, metaCid } = req.body

  try {
    // update
    await prisma.history.update({
      where: {
        id,
      },
      data: {
        ipfsGateway,
        imagesCid,
        metaCid,
        completed: true,
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

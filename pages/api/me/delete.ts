import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  const { address } = req.body

  if (!address)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  try {
    await prisma.user.deleteMany({
      where: {
        metamaskAddress: address,
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

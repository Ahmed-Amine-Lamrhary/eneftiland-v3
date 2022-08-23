import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    const { address } = req.body

    if (!address)
      return res.json({
        success: false,
        message: "Address is required",
      })

    // check if user exists
    const user = await prisma.user.findFirst({
      where: {
        metamaskAddress: address,
      },
    })

    if (!user) {
      await prisma.user.create({
        data: {
          metamaskAddress: address,
        },
      })
    }

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: user,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

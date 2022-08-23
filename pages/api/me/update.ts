import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  const { address } = req.body

  if (!address)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  const user: any = await prisma.user.findFirst({
    where: {
      metamaskAddress: address,
    },
  })

  const { name, email } = req.body

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        email,
      },
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: updatedUser,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

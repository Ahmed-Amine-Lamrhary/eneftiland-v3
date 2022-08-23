import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async (req: any, res: any) => {
  try {
    const { address, label, amount, method, currency } = req.body

    // if (!address)
    //   return res.json({
    //     success: false,
    //     message: "Not authorized",
    //   })

    const user: any = await prisma.user.findFirst({
      where: {
        metamaskAddress: address,
      },
    })

    await prisma.transaction.create({
      data: {
        userId: user?.id,
        label,
        amount,
        method,
        currency,
      },
    })

    const transactions = await prisma.transaction.findMany({
      orderBy: {
        dateCreated: "asc",
      },
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: transactions,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

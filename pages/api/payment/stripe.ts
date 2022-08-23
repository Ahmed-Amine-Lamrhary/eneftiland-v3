import { PrismaClient } from "@prisma/client"
import { CURRENCY, getPaymentAmount } from "../../../helpers/constants"

export default async (req: any, res: any) => {
  let { description, amount, id } = req.body

  const prisma = new PrismaClient()
  const settings = await prisma.settings.findFirst()
  const stripe = require("stripe")(settings?.stripeSecretKey)

  try {
    const payment = await stripe.paymentIntents.create({
      amount: getPaymentAmount(amount, CURRENCY),
      currency: CURRENCY,
      description,
      payment_method: id,
      confirm: true,
    })
    console.log("Payment", payment)
    res.json({
      message: "Payment successful",
      success: true,
    })
  } catch (error: any) {
    console.log("Error", error)
    res.json({
      message: error.message,
      success: false,
    })
  }
}

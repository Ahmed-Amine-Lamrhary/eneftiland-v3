import { PrismaClient } from "@prisma/client"
import { CURRENCY, getPaymentAmount } from "../../../helpers/constants"
import jwt from "jsonwebtoken"

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

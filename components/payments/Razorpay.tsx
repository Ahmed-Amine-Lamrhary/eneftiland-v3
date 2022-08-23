import React, { useCallback, useContext } from "react"
import useRazorpay, { RazorpayOptions } from "react-razorpay"
import AppContext from "../../context/AppContext"
import { CURRENCY, getPaymentAmount } from "../../helpers/constants"
import Button from "../Button"

interface RazorpayProps {
  description: string
  amount: any
  generate: any
}

const Razorpay = ({ description, amount, generate }: RazorpayProps) => {
  const Razorpay = useRazorpay()
  const { settings } = useContext(AppContext)

  const handlePayment = useCallback(() => {
    const options: RazorpayOptions = {
      key: settings?.razorpayPublicKey,
      amount: getPaymentAmount(amount, CURRENCY) + "",
      currency: CURRENCY,
      name: description,
      description,
      order_id: "",
      handler: async (res) => {
        await generate()
      },
    }

    const rzpay = new Razorpay(options)
    rzpay.open()
  }, [Razorpay])

  return (
    <div className="text-center">
      <Button className="btn-sm" onClick={handlePayment}>
        Pay now
      </Button>
    </div>
  )
}

export default Razorpay

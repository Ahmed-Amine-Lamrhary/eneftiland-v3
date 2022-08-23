import React, { useRef, useEffect, useContext } from "react"
import AppContext from "../../context/AppContext"
import { CURRENCY } from "../../helpers/constants"
import { showToast } from "../../helpers/utils"

interface PaypalProps {
  description: string
  amount: any
  generate: any
}

export default function Paypal({ description, amount, generate }: PaypalProps) {
  const paypal: any = useRef()
  const { settings } = useContext(AppContext)

  useEffect(() => {
    const win: any = window

    win.paypal
      ?.Buttons({
        style: {
          shape: "pill",
          color: "silver",
          layout: "horizontal",
          label: "buynow",
        },
        createOrder: (data: any, actions: any, err: any) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description,
                amount: {
                  currency_code: CURRENCY,
                  value: amount,
                },
              },
            ],
          })
        },
        onApprove: async (data: any, actions: any) => {
          // save transaction
          const order = await actions.order.capture()

          // generate
          await generate()
        },
        onError: (err: any) => {
          showToast("Payment was not completed successfully", "error")
          console.log(err)
        },
      })
      .render(paypal.current)
  }, [])

  if (typeof window !== "undefined") {
    const win: any = window

    return (
      <div className="paypal-payment">
        {!win.paypal ? (
          <div>Error with paypal configuration</div>
        ) : (
          <div ref={paypal}></div>
        )}
      </div>
    )
  }

  return null
}

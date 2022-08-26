import React, { useContext, useState } from "react"
import AppContext from "../../context/AppContext"
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import axios from "axios"
import { callApi, showToast } from "../../helpers/utils"
import Button from "../Button"

interface StripeProps {
  description: string
  amount: any
  generate: any
}

const CheckoutForm = ({ description, amount, generate }: StripeProps) => {
  const stripe: any = useStripe()
  const elements: any = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    })

    setLoading(false)

    if (!error) {
      try {
        const { id } = paymentMethod

        const { data } = await callApi({
          route: "payment/stripe",
          body: {
            description,
            amount,
            id,
          },
        })

        if (!data.success) return showToast(data.message, "error")

        if (data.success) {
          // save transaction

          // generate
          await generate()
        }
      } catch (error) {
        showToast("Payment was not completed successfully", "error")
        console.log(error)
      }
    } else {
      showToast("Payment was not completed successfully", "error")
      console.log(error)
    }
  }

  return (
    <div>
      <fieldset className="FormGroup">
        <div className="FormRow">
          <CardElement
            options={{
              style: {
                base: {
                  color: "#32325d",
                  lineHeight: "24px",
                  fontSmoothing: "antialiased",
                  fontSize: "16px",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#fa755a",
                  iconColor: "#fa755a",
                },
              },
            }}
          />
        </div>
      </fieldset>
      <div className="text-center mt-3">
        <Button className="btn-sm" onClick={handleSubmit} loading={loading}>
          Pay now
        </Button>
      </div>
    </div>
  )
}

const Stripe = ({ description, amount, generate }: StripeProps) => {
  const { settings } = useContext(AppContext)
  const stripePromise = loadStripe(settings?.stripePublishableKey)

  return (
    <div className="stripe-payment">
      <Elements stripe={stripePromise}>
        <CheckoutForm
          description={description}
          amount={amount}
          generate={generate}
        />
      </Elements>
    </div>
  )
}

export default Stripe

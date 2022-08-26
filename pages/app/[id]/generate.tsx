import { PrismaClient } from "@prisma/client"
import React, { useEffect } from "react"
import AppWrapper from "."
import GeneratePanel from "../../../components/app/panels/GeneratePanel"

export async function getServerSideProps(context: any) {
  const prisma = new PrismaClient()

  const settings = await prisma.settings.findFirst()
  const plans = await prisma.plan.findMany({
    orderBy: {
      assetsNumber: "asc",
    },
  })

  return {
    props: {
      settings,
      plans,
    },
  }
}

const generate = ({ settings, plans }: any) => {
  // paypal
  useEffect(() => {
    if (settings) {
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${settings.paypalClientId}`
      document.body.appendChild(script)
    }
  }, [])
  // paypal

  return (
    <AppWrapper settings={settings}>
      <GeneratePanel plans={plans} />
    </AppWrapper>
  )
}

export default generate

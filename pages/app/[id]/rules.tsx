import React from "react"
import AppWrapper from "."
import RulesPanel from "../../../components/app/panels/RulesPanel"
import { PrismaClient } from "@prisma/client"

export async function getServerSideProps(context: any) {
  const prisma = new PrismaClient()

  const settings = await prisma.settings.findFirst()

  return {
    props: {
      settings,
    },
  }
}

const rules = ({ settings }: any) => {
  return (
    <AppWrapper settings={settings}>
      <RulesPanel />
    </AppWrapper>
  )
}

export default rules

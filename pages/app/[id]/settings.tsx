import React from "react"
import AppWrapper from "."
import SettingsPanel from "../../../components/app/panels/SettingsPanel"
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

const settings = ({ settings }: any) => {
  return (
    <AppWrapper settings={settings}>
      <SettingsPanel />
    </AppWrapper>
  )
}

export default settings

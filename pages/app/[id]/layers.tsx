import { PrismaClient } from "@prisma/client"
import React from "react"
import AppWrapper from "."
import DesignerPanel from "../../../components/app/panels/DesignerPanel"

export async function getServerSideProps(context: any) {
  const prisma = new PrismaClient()

  const settings = await prisma.settings.findFirst()

  return {
    props: {
      settings,
    },
  }
}

const layers = ({ settings }: any) => {
  return (
    <AppWrapper settings={settings}>
      <DesignerPanel />
    </AppWrapper>
  )
}

export default layers

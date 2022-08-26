import React from "react"
import AppWrapper from "."
import GalleryPanel from "../../../components/app/panels/GalleryPanel"
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

const gallery = ({ settings }: any) => {
  return (
    <AppWrapper settings={settings}>
      <GalleryPanel />
    </AppWrapper>
  )
}

export default gallery

import React from "react"
import Section from "../components/Section"
import Page from "../components/Page"
import { PrismaClient } from "@prisma/client"

export async function getServerSideProps(context: any) {
  const prisma = new PrismaClient()

  const privacyPage = await prisma.privacyPage.findFirst()
  const settings = await prisma.settings.findFirst()

  return {
    props: {
      data: privacyPage,
      settings,
    },
  }
}

const PrivaryPage = ({ data, settings }: any) => {
  return (
    <Page title="Privary Policy" settings={settings}>
      <Section className="terms-privacy">
        <h1>{data?.title ? data?.title : "Privacy policy"}</h1>

        <div dangerouslySetInnerHTML={{ __html: data?.content }} />
      </Section>
    </Page>
  )
}

export default PrivaryPage
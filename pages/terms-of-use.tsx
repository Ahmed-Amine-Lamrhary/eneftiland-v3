import React from "react"
import Section from "../components/Section"
import Page from "../components/Page"
import { PrismaClient } from "@prisma/client"

export async function getServerSideProps(context: any) {
  const prisma = new PrismaClient()

  const termsPage = await prisma.termsPage.findFirst()
  const settings = await prisma.settings.findFirst()

  return {
    props: {
      data: termsPage,
      settings,
    },
  }
}

const TermsPage = ({ data, settings }: any) => {
  return (
    <Page title="Terms and Services" settings={settings}>
      <Section className="terms-privacy">
        <h1>{data?.title ? data?.title : "Terms of use"}</h1>

        <div dangerouslySetInnerHTML={{ __html: data?.content }} />
      </Section>
    </Page>
  )
}

export default TermsPage

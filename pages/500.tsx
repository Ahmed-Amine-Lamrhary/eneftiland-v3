import React from "react"
import Heading from "../components/Heading"
import Section from "../components/Section"
import Page from "../components/Page"

const Page500 = () => {
  return (
    <Page title="Server error" settings={null}>
      <Section>
        <Heading
          title="Oops!"
          subTitle="500"
          paragraph="Internal server error"
        />
      </Section>
    </Page>
  )
}

export default Page500

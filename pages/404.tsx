import React from "react"
import Heading from "../components/Heading"
import Section from "../components/Section"
import Page from "../components/Page"
import Button from "../components/Button"

const Page404 = () => {
  return (
    <Page title="404 Page" settings={null}>
      <Section>
        <Heading
          title="Oops!"
          subTitle="404"
          paragraph="There’s nothing here, but if you feel this is an error please let us know."
        />
        <Button theme="white" to="/">
          Go Back To Home Page
        </Button>
      </Section>
    </Page>
  )
}

export default Page404

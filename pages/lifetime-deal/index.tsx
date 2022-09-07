import Page from "../../components/Page"
import { callApi, showToast } from "../../helpers/utils"
import { PrismaClient } from "@prisma/client"
import { getSession, useSession } from "next-auth/react"
import AppModal from "../../components/AppModal"
import { useState } from "react"
import { Form, Formik } from "formik"
import FormControl from "../../components/FormControl"
import Button from "../../components/Button"
import * as Yup from "yup"
import Section from "../../components/Section"
import Heading from "../../components/Heading"
import LifetimePlan from "../../components/LifetimePlan"

const CodeSchema = Yup.object().shape({
  code: Yup.string().required("Redumption code is required"),
})

export async function getServerSideProps(context: any) {
  const { req } = context
  const session = await getSession({ req })

  if (!session)
    return {
      redirect: { destination: "/" },
    }

  const prisma = new PrismaClient()
  const settings = await prisma.settings.findFirst()

  return {
    props: {
      settings,
    },
  }
}

export default function MePage({ settings }: any) {
  const { data: session }: any = useSession()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const activateLifetime = async (values: any) => {
    try {
      setLoading(true)
      const { data } = await callApi({
        route: "me/lifetime",
        body: {
          ...values,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      showToast(data.message, "success")
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page title="Lifetime deal" settings={settings}>
      <AppModal size="sm" show={show} onHide={() => setShow(false)}>
        <Formik
          initialValues={{
            code: "",
          }}
          validationSchema={CodeSchema}
          onSubmit={activateLifetime}
        >
          {(form) => (
            <Form>
              <div className="row">
                <div>
                  <FormControl
                    type="text"
                    name="code"
                    placeholder="Redumption code"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button loading={loading} className="btn-sm me-2" type="submit">
                Activate Lifetime
              </Button>
            </Form>
          )}
        </Formik>
      </AppModal>

      <div className="container small-container">
        <Section>
          <Heading
            title="Lifetime Deal"
            subTitle="Get unlimited access for the lifetime of eneftiland!"
            paragraph="One-time purchase for a life-time access to the all features."
          >
            {!session?.user.lifetime && (
              <div className="mt-4">
                <Button className="btn-black" onClick={() => setShow(true)}>
                  I have a code!
                </Button>
              </div>
            )}
          </Heading>

          <div className="row justify-content-center">
            <div className="col-md-4">
              <LifetimePlan />
            </div>
          </div>
        </Section>
      </div>
    </Page>
  )
}

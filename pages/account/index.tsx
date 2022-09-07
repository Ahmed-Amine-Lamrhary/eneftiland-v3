import Page from "../../components/Page"
import * as Yup from "yup"
import { Form, Formik } from "formik"
import FormControl from "../../components/FormControl"
import Button from "../../components/Button"
import { callApi, showToast } from "../../helpers/utils"
import TransactionsTable from "../../components/TransactionsTable"
import { PrismaClient } from "@prisma/client"
import { Tab, Tabs } from "react-bootstrap"
import swal from "sweetalert2"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import debounce from "lodash.debounce"
import { getSession, useSession } from "next-auth/react"
import ListCollections from "../../components/ListCollections"

const UserSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email(),
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
  const { data: session, status }: any = useSession()

  const [myCollections, setMyCollections] = useState<any>([])
  const [myCollectionsCount, setMyCollectionsCount] = useState(0)

  const [myCollabs, setMyCollabs] = useState<any>([])
  const [myCollabsCount, setMyCollabsCount] = useState(0)

  const [mycollectionsLoading, setMycollectionsLoading] = useState(false)
  const [mycollabsLoading, setMycollabsLoading] = useState(false)

  const [updateLoading, setUpdateLoading] = useState(false)

  const [query, setQuery] = useState("")

  useEffect(() => {
    if (status === "authenticated") verify(query)
  }, [query])

  const verify = useCallback(
    debounce((query) => {
      getMyCollections(query)
    }, 500),
    []
  )

  const getMyCollections = async (query?: string) => {
    try {
      setMycollectionsLoading(true)

      const { data } = await callApi({
        route: "me/mycollections",
        body: {
          query,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      setMyCollectionsCount(data.count)
      setMyCollections(data.data)
    } catch (error: any) {
      throw error
    } finally {
      setMycollectionsLoading(false)
    }
  }

  const getMyCollabs = async (query?: string) => {
    try {
      setMycollabsLoading(true)

      const { data } = await callApi({
        route: "me/mycollabs",
      })

      if (!data.success) return showToast(data.message, "error")

      console.log(data.data)

      setMyCollabsCount(data.count)
      setMyCollabs(data.data)
    } catch (error: any) {
      throw error
    } finally {
      setMycollabsLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      getMyCollections()
      getMyCollabs()
    }
  }, [status])

  const getTransactions = async (page?: any) => {
    try {
      const { data } = await callApi({
        route: "me/transactions",
        body: {
          page,
        },
      })

      return data
    } catch (error: any) {
      throw error
    }
  }

  const updateMe = async (values: any) => {
    try {
      const { data } = await callApi({
        route: "me/update",
        body: {
          ...values,
        },
      })

      if (!data.success) return showToast(data.message, "error")
      showToast(data.message, "success")
    } catch (error: any) {
      showToast(error.message, "error")
    }
  }

  const duplicateCollection = async (collectionId: any) => {
    setUpdateLoading(true)

    try {
      const { data } = await callApi({
        route: "me/duplicatecollection",
        body: {
          id: collectionId,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      await getMyCollections()
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setUpdateLoading(false)
    }
  }

  const deleteCollection = async (collectionId: any) => {
    const willDelete = await swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this collection?",
      icon: "warning",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No, Cancel",
      showCancelButton: true,
      showCloseButton: true,
    })

    if (!willDelete.isConfirmed) return

    setUpdateLoading(true)
    try {
      const { data } = await callApi({
        route: "me/deletecollection",
        body: {
          id: collectionId,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      await getMyCollections()
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setUpdateLoading(false)
    }
  }

  return (
    <Page title="My account" settings={settings}>
      <div className="my-account">
        <div className="container" style={{ position: "relative" }}>
          {updateLoading && <div className="overlay" />}

          <Tabs defaultActiveKey="my-collections" id="account-tabs">
            <Tab eventKey="my-collections" title="My collections">
              <ListCollections
                data={myCollections}
                setData={setMyCollections}
                count={myCollectionsCount}
                loading={mycollectionsLoading}
                setQuery={setQuery}
                duplicateCollection={duplicateCollection}
                deleteCollection={deleteCollection}
              />
            </Tab>

            <Tab eventKey="my-collaborations" title="My collaborations">
              <ListCollections
                data={myCollabs}
                setData={setMyCollabs}
                count={myCollabsCount}
                loading={mycollabsLoading}
              />
            </Tab>

            <Tab eventKey="update-profile" title="Update profile">
              {session?.user && (
                <Formik
                  initialValues={{
                    name: session?.user?.name,
                    email: session?.user?.email,
                  }}
                  validationSchema={UserSchema}
                  onSubmit={updateMe}
                >
                  {(form) => (
                    <Form>
                      <div className="row">
                        <div>
                          <FormControl
                            type="text"
                            name="name"
                            placeholder="Name (Optional)"
                          />
                        </div>

                        <div>
                          <FormControl
                            type="email"
                            name="email"
                            placeholder="Email (Optional)"
                            disabled
                          />
                        </div>
                      </div>

                      <Button className="btn-sm me-2" type="submit">
                        Update
                      </Button>
                    </Form>
                  )}
                </Formik>
              )}
            </Tab>

            <Tab eventKey="trans" title="My transactions">
              <TransactionsTable getTransactions={getTransactions} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </Page>
  )
}

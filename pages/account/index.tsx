import Page from "../../components/Page"
import * as Yup from "yup"
import { Form, Formik } from "formik"
import FormControl from "../../components/FormControl"
import Button from "../../components/Button"
import axios from "axios"
import {
  callApi,
  getConnectedUser,
  saveConnectedUser,
  showToast,
} from "../../helpers/utils"
import TransactionsTable from "../../components/TransactionsTable"
import { PrismaClient } from "@prisma/client"
import { Tab, Tabs } from "react-bootstrap"
import swal from "sweetalert2"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import CollectionBlock from "../../components/CollectionBlock"
import debounce from "lodash.debounce"
import { useWeb3React } from "@web3-react/core"

const UserSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email(),
})

export async function getServerSideProps(context: any) {
  const prisma = new PrismaClient()

  const settings = await prisma.settings.findFirst()

  return {
    props: {
      settings,
    },
  }
}

export default function MePage({ settings }: any) {
  const { active, account, activate, deactivate, error } = useWeb3React()

  const [myCollections, setMyCollections] = useState<any>([])
  const [myCollectionsCount, setMyCollectionsCount] = useState(0)

  const [getLoading, setGetLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)

  const [query, setQuery] = useState("")

  useEffect(() => {
    verify(query)
  }, [query])

  const verify = useCallback(
    debounce((query) => {
      getMyCollections(query)
    }, 500),
    []
  )

  const getMyCollections = async (query?: string) => {
    try {
      setGetLoading(true)

      const { data } = await callApi({
        route: "me/mycollections",
        body: {
          address: account,
          query,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      setMyCollectionsCount(data.count)
      setMyCollections(data.data)
    } catch (error: any) {
      throw error
    } finally {
      setGetLoading(false)
    }
  }

  useEffect(() => {
    if (account) getMyCollections()
  }, [account])

  const getTransactions = async (page?: any) => {
    try {
      const { data } = await callApi({
        route: "me/transactions",
        body: {
          address: account,
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
          address: account,
          ...values,
        },
      })

      if (!data.success) return showToast(data.message, "error")
      showToast(data.message, "success")

      saveConnectedUser(data.data)
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
          address: account,
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
          address: account,
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

  const sortMyCollections = (e: any) => {
    const sortBy = e.target.value

    const sorted = myCollections
      .slice()
      .sort((collection1: any, collection2: any) => {
        const v1 =
          sortBy === "dateCreated"
            ? new Date(collection1[sortBy]).getTime()
            : collection1[sortBy]
        const v2 =
          sortBy === "dateCreated"
            ? new Date(collection2[sortBy]).getTime()
            : collection2[sortBy]
        return v2 - v1
      })

    setMyCollections(sorted)
  }

  return (
    <Page title="My account" settings={settings} isProtected>
      <div className="my-account">
        <div className="container" style={{ position: "relative" }}>
          {updateLoading && <div className="overlay" />}

          <Tabs defaultActiveKey="my-collections" id="account-tabs">
            <Tab eventKey="my-collections" title="My collections">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="form-group">
                    <select
                      className="form-select"
                      onChange={sortMyCollections}
                    >
                      <option value="collectionName">Name</option>
                      <option value="dateCreated">Latest</option>
                      <option value="collectionSize">Largest</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name"
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <p className="mb-3 paragraph">
                You have {myCollectionsCount} collections
              </p>

              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <CollectionBlock addNew />
                </div>

                {getLoading ? (
                  <>
                    {Array.from(Array(3).keys()).map(() => (
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <CollectionBlock loading />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {myCollections.map((c: any, index: number) => (
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <CollectionBlock
                          collection={c}
                          duplicateCollection={duplicateCollection}
                          deleteCollection={deleteCollection}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </Tab>

            <Tab eventKey="update-profile" title="Update profile">
              <Formik
                initialValues={{
                  name: getConnectedUser()?.name,
                  email: getConnectedUser()?.email,
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
                        />
                      </div>
                    </div>

                    <Button className="btn-sm me-2" type="submit">
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
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

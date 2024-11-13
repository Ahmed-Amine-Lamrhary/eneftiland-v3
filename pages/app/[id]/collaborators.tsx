import { PrismaClient } from "@prisma/client"
import React, { useState } from "react"
import Page from "../../../components/Page"
import { parseCollection } from "../../../services/parser"
import * as Yup from "yup"
import { Form, Formik } from "formik"
import Button from "../../../components/Button"
import { IoPeopleOutline } from "react-icons/io5"
import AppModal from "../../../components/AppModal"
import { callApi, showToast } from "../../../helpers/utils"
import swal from "sweetalert2"
import SearchCollab from "../../../components/SearchCollab"
import { AiOutlineArrowLeft } from "react-icons/ai"
import { getSession } from "next-auth/react"

const schema = Yup.object().shape({
  email: Yup.object().required("User email is required"),
})

export async function getServerSideProps(context: any) {
  const { id } = context.query

  const { req } = context
  const session: any = await getSession({ req })

  if (!session)
    return {
      redirect: { destination: "/" },
    }

  const prisma = new PrismaClient()

  const settings = await prisma.settings.findFirst()

  const collection = await prisma.collection.findFirst({
    where: {
      id,
      userId: session?.user?.id,
    },
  })

  if (!collection)
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    }

  const collaborations = await prisma.collaborations.findMany({
    where: {
      collectionId: id,
    },
    select: {
      user: true,
      userId: true,
      collectionId: true,
      dateCreated: false,
    },
  })

  return {
    props: {
      settings,
      collection: parseCollection(collection),
      collaborationsData: collaborations,
    },
  }
}

const Item = ({ collaboration, setCollaborations, collaborations }: any) => {
  const [loading, setLoading] = useState(false)

  const removeCollab = async (collaborationId: any) => {
    try {
      const willDelete = await swal.fire({
        title: "Are you sure?",
        text: "Are you sure you want to remove this collaborator?",
        icon: "warning",
        confirmButtonText: "Yes, Remove",
        cancelButtonText: "No, Cancel",
        showCancelButton: true,
        showCloseButton: true,
      })

      if (!willDelete.isConfirmed) return

      setLoading(true)

      const { data } = await callApi({
        route: "collection/removeCollaborator",
        body: {
          collaborationId,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      showToast(data.message, "success")
      setCollaborations(
        [...collaborations].filter((c) => c.id !== collaborationId)
      )
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="collaboration-item">
      <div>
        <span className="name">{collaboration.user.name}</span>
        <span className="email">{collaboration.user.email}</span>
      </div>

      <div>
        <Button
          onClick={() => removeCollab(collaboration.id)}
          className="btn-sm"
          disabled={loading}
          loading={loading}
        >
          Remove
        </Button>
      </div>
    </div>
  )
}

const collaborators = ({ settings, collection, collaborationsData }: any) => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [collaborations, setCollaborations] = useState(collaborationsData)

  const addCollab = async (values: any) => {
    setLoading(true)

    try {
      const { data } = await callApi({
        route: "collection/addCollaborator",
        body: {
          collectionId: collection.id,
          email: values.email.value,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      showToast(data.message, "success")
      setCollaborations([...data.data])
      setShow(false)
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page title={collection.collectionName} settings={settings}>
      <AppModal size="sm" show={show} onHide={() => setShow(false)}>
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={schema}
          onSubmit={addCollab}
        >
          {({ dirty }) => (
            <Form>
              <div className="row">
                <h5 className="text-center mb-4 fw-normal">
                  Add a collaborator to <br />
                  <span className="fw-bolder">{collection.collectionName}</span>
                </h5>

                <SearchCollab />
              </div>

              <Button
                className="btn-sm me-2 w-100"
                type="submit"
                disabled={!dirty}
                loading={loading}
              >
                Select a collaborator above
              </Button>
            </Form>
          )}
        </Formik>
      </AppModal>

      <div className="collaborators">
        <div className="container x-small-container">
          <div className="mb-5">
            <Button className="btn-xs" to={`/app/${collection?.id}`}>
              <AiOutlineArrowLeft /> Back to collection
            </Button>
          </div>

          <div className="collaborators-box text-center">
            {collaborations && collaborations.length > 0 ? (
              <>
                <h5 className="text-start mb-4">Manage collaborations</h5>

                {collaborations.map((collaboration: any) => (
                  <Item
                    collaboration={collaboration}
                    setCollaborations={setCollaborations}
                    collaborations={collaborations}
                  />
                ))}
              </>
            ) : (
              <>
                <div className="mb-3 collabs-icon">
                  <IoPeopleOutline size={55} />
                </div>

                <h5>You haven't invited any collaborators yet</h5>
              </>
            )}

            <div className="mt-4">
              <Button
                className="btn-sm btn-outline"
                onClick={() => setShow(true)}
              >
                Add people
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default collaborators

import React, { useEffect } from "react"
import { callApi, showToast } from "../../helpers/utils"
import Page from "../../components/Page"
import { PrismaClient } from "@prisma/client"
import { useRouter } from "next/router"
import AppLoader from "../../components/AppLoader"
import { getSession, useSession } from "next-auth/react"

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

const index = ({ settings }: any) => {
  const router = useRouter()
  const { data: session } = useSession()

  const createNewCollection = async () => {
    try {
      const { data } = await callApi({
        route: "me/newcollection",
      })

      if (!data.success) return showToast(data.message, "error")

      router.push(`/app/${data.data.id}`)
    } catch (error: any) {
      showToast(error.message, "error")
      console.log(error)
    }
  }

  useEffect(() => {
    if (session) createNewCollection()
  }, [session])

  return (
    <Page title="Creating new collection" settings={settings}>
      <div className="container">
        <div className="creating-collection-page">
          <AppLoader />
          <p className="paragraph">Creating a new collection</p>
        </div>
      </div>
    </Page>
  )
}

export default index

import React, { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { callApi, showToast } from "../../helpers/utils"
import Page from "../../components/Page"
import { PrismaClient } from "@prisma/client"
import { useRouter } from "next/router"
import AppLoader from "../../components/AppLoader"

export async function getServerSideProps(context: any) {
  const prisma = new PrismaClient()

  const settings = await prisma.settings.findFirst()

  return {
    props: {
      settings,
    },
  }
}

const index = ({ settings }: any) => {
  const { active, account, activate, deactivate } = useWeb3React()
  const router = useRouter()

  const createNewCollection = async () => {
    try {
      const { data } = await callApi({
        route: "me/newcollection",
        body: {
          address: account,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      router.push(`/app/${data.data.id}`)
    } catch (error: any) {
      showToast(error.message, "error")
      console.log(error)
    }
  }

  useEffect(() => {
    if (account) createNewCollection()
  }, [account])

  return (
    <Page title="Creating new collection" settings={settings} isProtected>
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

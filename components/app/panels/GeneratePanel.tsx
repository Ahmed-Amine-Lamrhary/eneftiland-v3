import axios from "axios"
import moment from "moment"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import { Dropdown } from "react-bootstrap"
import { AiOutlineEye } from "react-icons/ai"
import { BsThreeDots } from "react-icons/bs"
import { IoImageOutline } from "react-icons/io5"
import { MdOutlineCollections } from "react-icons/md"
import AppContext from "../../../context/AppContext"
import { showToast } from "../../../helpers/utils"
import ipfsProvidersType from "../../../types/ipfsProviders"
import payMethodsType from "../../../types/payMethods"
import AppLoader from "../../AppLoader"
import AppModal from "../../AppModal"
import Button from "../../Button"
import NoDataFound from "../../NoDataFound"
import Pay from "../../payments/Pay"

const GeneratePanel = ({ plans }: any) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<any>(null)

  // payment
  const [showPayment, setShowPayment] = useState<boolean>(false)
  const [paymentMethod, setPaymentMethod] = useState<payMethodsType>(undefined)

  // choose IPFS provider
  const [showIPFSProvider, setShowIPFSProvider] = useState<boolean>(true)
  const [ipfsProvider, setIpfsProvider] =
    useState<ipfsProvidersType>("nftstorage")
  const [pinataJWT, setPinataJWT] = useState("")

  //
  const [loading, setLoading] = useState(false)

  const [history, setHistory] = useState([])

  const { collection, setView }: any = useContext(AppContext)

  const router = useRouter()
  const { id: collectionId }: any = router.query

  useEffect(() => {
    getCollectionHistory()
  }, [])

  const getCollectionHistory = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post("/api/me/history/get", {
        id: collectionId,
      })

      setHistory(data.data)
    } catch (error: any) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const item = (historyItem: any) => {
    const day = moment(new Date(historyItem.dateCreated)).format("dddd, MMMM")
    const time = moment(new Date(historyItem.dateCreated)).format("HH:mm A")

    return (
      <div className="generated-item">
        <h6>{`${day} at ${time}`}</h6>
        <p>
          {historyItem.collectionSize} token
          {historyItem.collectionSize > 1 && "s"}
        </p>

        <Dropdown align="end">
          <Dropdown.Toggle id="dropdown-basic">
            <BsThreeDots />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => regenerateMeta(historyItem.id)}>
              Regenerate metadata
            </Dropdown.Item>

            <Dropdown.Item
              href={`${historyItem?.ipfsGateway}/${historyItem.imagesCid}`}
              target="_blank"
            >
              View images
            </Dropdown.Item>
            <Dropdown.Item
              href={`${historyItem?.ipfsGateway}/${historyItem.metaCid}`}
              target="_blank"
            >
              View metadata
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }

  const generate = async () => {
    if (plans && plans.length > 0) {
      const currentPlan = getUsedPlan()
      if (currentPlan) {
        setCurrentPlan(currentPlan)

        if (
          currentPlan.priceToRemoveWatermark &&
          currentPlan.priceToRemoveWatermark > 0
        )
          return setShowPayment(true)

        if (currentPlan.price > 0) return setShowPayment(true)
      }
    }

    // test pinata authentication
    // if (ipfsProvider === "pinata") {
    //   try {
    //     await axios({
    //       method: "get",
    //       url: "https://api.pinata.cloud/data/testAuthentication",
    //       headers: {
    //         Authorization: `Bearer ${pinataJWT}`,
    //       },
    //     })
    //   } catch (error) {
    //     return showToast(
    //       "Pinata authentication failed, please check your JWT",
    //       "error"
    //     )
    //   }
    // }

    await startGenerating()
  }

  const regenerateMeta = async (historyId: any) => {
    setIsGenerating(true)

    try {
      const { data } = await axios.post(`/api/me/regenerate_meta/${historyId}`)

      if (!data.success) return showToast(data.message, "error")

      await getCollectionHistory()
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setIsGenerating(false)
    }
  }

  interface StartGeneratingI {
    isWatermark?: boolean
  }

  const startGenerating = async (options?: StartGeneratingI) => {
    const { isWatermark } = options || {}
    const currentPlan = getUsedPlan()

    setIsGenerating(true)
    setShowPayment(false)

    try {
      const { data } = await axios.post(
        `/api/me/generatecollection/${collectionId}`,
        {
          ipfsProvider,
          watermark:
            isWatermark === undefined ? currentPlan?.watermark : isWatermark,
        }
      )

      if (!data.success) return showToast(data.message, "error")

      await getCollectionHistory()
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setIsGenerating(false)
    }
  }

  const getUsedPlan = () => {
    if (collection?.collectionSize <= plans[0]?.assetsNumber) return plans[0]

    for (let i = 0; i < plans.length; i++) {
      const p = plans[i]
      const nextP = plans[i + 1]

      if (!nextP) return p

      if (
        nextP &&
        collection?.collectionSize > p.assetsNumber &&
        collection?.collectionSize <= nextP.assetsNumber
      ) {
        return nextP
      }
    }
  }

  return (
    <div>
      {/* choose IPFS provider */}
      {/* <AppModal
        show={showIPFSProvider}
        onHide={() => setShowIPFSProvider(false)}
        size="lg"
      >
        <h4>Select your IPFS provider</h4>
        <p className="paragraph">
          Your collection will be directly uploaded to IPFS after generated.
        </p>

        <div className="form-group mt-4">
          <select
            className="form-select"
            value={ipfsProvider}
            onChange={(e: any) => setIpfsProvider(e.target.value)}
          >
            <option value="nftstorage">NFTStorage</option>
            <option value="pinata">Pinata</option>
          </select>
        </div>

        {ipfsProvider === "pinata" && (
          <>
            <p className="paragraph">Please enter your Admin Pinata JWT.</p>
            <div className="form-group mt-3">
              <textarea
                className="form-control"
                value={pinataJWT}
                onChange={(e) => setPinataJWT(e.target.value)}
              />
            </div>
          </>
        )}

        <Button theme="white" onClick={generate}>
          Generate
        </Button>
      </AppModal> */}

      {/* pay */}
      <AppModal
        show={showPayment}
        onHide={() => setShowPayment(false)}
        size="lg"
      >
        <Pay
          description={collection?.collectionName}
          currentPlan={currentPlan}
          generate={startGenerating}
          setShowPayment={setShowPayment}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </AppModal>

      {/* generating & downloading modal */}
      <AppModal show={isGenerating} onHide={null} size="lg" closeButton={false}>
        <div className="text-center pb-5">
          <AppLoader />
          <div className="mt-3">
            <h5>Generating your collection...</h5>
            <p className="paragraph">
              Please don't close your browser, this can take a few minutes.
            </p>
          </div>
        </div>
      </AppModal>

      <div className="container">
        <div className="mb-5">
          <h3>Generate tokens</h3>
          <p className="paragraph">
            Ready to generate your tokens? Let’s get started!
          </p>
          <p className="paragraph">
            This will generate a tokenset based on the preview you have seen in
            the gallery.
          </p>
        </div>

        {/* generate */}
        <div className="d-flex justify-content-center mb-4">
          <Button
            theme="white"
            onClick={generate}
            disabled={collection.results.length === 0}
          >
            <MdOutlineCollections size={20} /> Generate Now
          </Button>
          <Button className="ms-3" onClick={() => setView("preview")}>
            <AiOutlineEye size={20} /> Gallery
          </Button>
        </div>

        {/* history */}
        <div>
          <h6 className="heading text-ink-1000">Tokens history</h6>
        </div>

        {loading ? (
          <AppLoader />
        ) : (
          <>
            {history?.length === 0 && (
              <NoDataFound phrase="History is empty" Icon={IoImageOutline} />
            )}
            {history?.map((i: any) => item(i))}
          </>
        )}
      </div>
    </div>
  )
}

export default GeneratePanel

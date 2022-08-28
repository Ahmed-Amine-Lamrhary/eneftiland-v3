import { MemoryBlockStore } from "ipfs-car/blockstore/memory"
import { packToBlob } from "ipfs-car/pack/blob"
import moment from "moment"
import { useRouter } from "next/router"
import { NFTStorage } from "nft.storage"
import React, { useContext, useEffect, useState } from "react"
import { Dropdown } from "react-bootstrap"
import { AiOutlineEye } from "react-icons/ai"
import { BsThreeDots } from "react-icons/bs"
import { IoImageOutline } from "react-icons/io5"
import { MdOutlineCollections } from "react-icons/md"
import AppContext from "../../../context/AppContext"
import { callApi, getMetadata, showToast } from "../../../helpers/utils"
import ipfsProvidersType from "../../../types/ipfsProviders"
import payMethodsType from "../../../types/payMethods"
import AppLoader from "../../AppLoader"
import AppModal from "../../AppModal"
import Button from "../../Button"
import NoDataFound from "../../NoDataFound"
import Pay from "../../payments/Pay"

const GeneratePanel = ({ plans, settings }: any) => {
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<any>(null)

  const [generatingStatus, setGeneratingStatus] = useState(
    "Generating your collection..."
  )

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

      const { data } = await callApi({
        route: "me/history/get",
        body: {
          id: collectionId,
        },
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
      <div
        className={`generated-item ${
          !historyItem.completed ? "not-completed" : ""
        }`}
      >
        <h6>{`${day} at ${time}`}</h6>
        <p>
          {historyItem.collectionSize} token
          {historyItem.collectionSize > 1 && "s"}
        </p>

        {!historyItem.completed ? (
          <div className="d-flex align-items-center">
            <p className="error-text me-4">Error while generating</p>
            <Button
              className="btn-sm btn-outline btn-danger"
              onClick={() => generateAgain(historyItem.id)}
            >
              Generate Again
            </Button>
          </div>
        ) : (
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
        )}
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

    await startGeneratingBrowser()
  }

  const regenerateMeta = async (historyId: any) => {
    setIsGeneratingMeta(true)

    try {
      const { data } = await callApi({
        route: `me/regenerate_meta/${historyId}`,
      })

      if (!data.success) return showToast(data.message, "error")

      await getCollectionHistory()
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setIsGeneratingMeta(false)
    }
  }

  interface StartGeneratingI {
    isWatermark?: boolean
  }

  // browser
  const getLayersImages = async ({ collection, noFile = false }: any) => {
    const allLayersImages: any = []
    await Promise.all(
      collection.galleryLayers.map(async (layer: any) => {
        await Promise.all(
          layer.images.map(async (image: any) => {
            let r
            if (!noFile) r = await loadImage(image.url)

            allLayersImages.push({
              id: image.id,
              name: image.name,
              file: r,
              filename: image.filename,
              url: image.url,
            })
          })
        )
      })
    )

    return allLayersImages
  }
  const getWatermarkCred = ({ dimensions, position }: any) => {
    const watermarkSize = dimensions / 4

    let x,
      y,
      w = watermarkSize,
      h = watermarkSize

    switch (position) {
      case "top-left":
        x = 0
        y = 0
        break
      case "top-right":
        x = dimensions - watermarkSize
        y = 0
        break
      case "bottom-left":
        x = 0
        y = dimensions - watermarkSize
        break
      case "bottom-right":
        x = dimensions - watermarkSize
        y = dimensions - watermarkSize
        break
      case "center":
        x = dimensions / 2 - watermarkSize / 2
        y = dimensions / 2 - watermarkSize / 2
        break
      case "full":
        x = 0
        y = 0
        w = dimensions
        h = dimensions
        break
    }

    return { x, y, w, h }
  }
  function loadImage(url: string) {
    return new Promise((r) => {
      let i = new Image()
      i.crossOrigin = "anonymous"
      i.onload = () => r(i)
      i.src = url
    })
  }

  const startGeneratingBrowser = async (options?: StartGeneratingI) => {
    const { isWatermark } = options || {}
    const currentPlan = getUsedPlan()

    const watermark =
      isWatermark === undefined ? currentPlan?.watermark : isWatermark

    setIsGenerating(true)
    setShowPayment(false)

    try {
      // add to history
      const { data } = await callApi({
        route: "me/history/create",
        body: {
          collectionId,
        },
      })

      const history = data.data

      const dimensions = collection.size

      const canvas = document.createElement("canvas")
      canvas.width = dimensions
      canvas.height = dimensions
      const ctx: any = canvas.getContext("2d")

      const allLayersImages = await getLayersImages({
        collection,
      })

      // watermark
      const watermarkUrl = settings?.watermarkUrl
      const watermarkImg = watermarkUrl ? await loadImage(watermarkUrl) : null
      // watermark

      const nfts: any = []
      const metas: any = []

      let i = 0

      const func = async () => {
        if (i < collection.results.length) {
          const item = collection.results[i]

          // metadata
          const { metadata, edition } = getMetadata(collection, item, i)
          metas.push(metadata)

          // image
          const loadedImages: any = []

          item?.attributes.forEach((attr: any) => {
            const f = allLayersImages.find((u: any) => u.id === attr.id)
            loadedImages.push(f.file)
          })

          //////////////////// creating nft /////////////////////
          loadedImages.forEach((img: any) => {
            ctx.drawImage(img, 0, 0, dimensions, dimensions)
          })

          if (watermark && watermarkImg) {
            const { x, y, w, h } = getWatermarkCred({
              dimensions,
              position: settings?.watermarkPos,
            })

            ctx.drawImage(watermarkImg, x, y, w, h)
          }
          const imageName = `${edition}.png`
          const canvasType: any = "image/png"
          const img = new Buffer(
            canvas.toDataURL(canvasType).split(",")[1],
            "base64"
          )
          //////////////////// creating nft /////////////////////

          nfts.push({
            data: img,
            name: imageName,
            index: i,
          })

          ctx.clearRect(0, 0, dimensions, dimensions)
          ctx.beginPath()

          setGeneratingStatus("Generared " + (i + 1))

          set()
        } else {
          setGeneratingStatus("Uploading to IPFS...")

          // upload to IPFS
          const ipfsGateway = "https://nftstorage.link/ipfs"
          const client = new NFTStorage({
            token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || "",
          })

          // images
          nfts.sort((a: any, b: any) => a.index - b.index)

          const { car: nftsCar } = await packToBlob({
            input: [
              ...nfts.map((nft: any) => ({
                path: nft.name,
                content: nft.data,
              })),
            ],
            blockstore: new MemoryBlockStore(),
          })

          setGeneratingStatus("Generated nfts car file")
          setGeneratingStatus("Uploading nfts car file...")

          const nftsCid = await client.storeCar(nftsCar)

          // metadata
          metas.forEach((meta: any) => {
            meta.image = meta.image.replace("<CID>", nftsCid)
          })

          const { car: metasCar } = await packToBlob({
            input: [
              ...metas.map((meta: any, index: number) => ({
                path: `${index + 1}.json`,
                content: Buffer.from(JSON.stringify(meta)),
              })),
              {
                path: "_metadata.json",
                content: Buffer.from(JSON.stringify(metas)),
              },
            ],
            blockstore: new MemoryBlockStore(),
          })

          setGeneratingStatus("Generated metadata car file")
          setGeneratingStatus("Uploading metadata car file...")

          const metasCid = await client.storeCar(metasCar)

          console.log(nftsCid)
          console.log(metasCid)

          // update history
          await callApi({
            route: "me/history/update",
            body: {
              id: history.id,
              ipfsGateway,
              imagesCid: nftsCid,
              metaCid: metasCid,
            },
          })

          setIsGenerating(false)
          await getCollectionHistory()
        }
      }

      const set = async () => {
        setTimeout(async () => {
          await func()
          i++
        }, 1)
      }

      set()
    } catch (error: any) {
      console.log(error)
      showToast(error.message, "error")
    }
  }
  // browser

  const startGenerating = async (options?: StartGeneratingI) => {
    const { isWatermark } = options || {}
    const currentPlan = getUsedPlan()

    setIsGenerating(true)
    setShowPayment(false)

    try {
      const { data } = await callApi({
        route: `me/generatecollection/${collectionId}`,
        body: {
          ipfsProvider,
          watermark:
            isWatermark === undefined ? currentPlan?.watermark : isWatermark,
        },
      })

      if (!data.success) return showToast(data.message, "error")
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setIsGenerating(false)
      await getCollectionHistory()
    }
  }

  const generateAgain = async (historyId: any) => {
    setIsGenerating(true)
    setShowPayment(false)

    try {
      const { data } = await callApi({
        route: `me/generateagain/${historyId}`,
      })

      if (!data.success) return showToast(data.message, "error")
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setIsGenerating(false)
      await getCollectionHistory()
    }
  }

  const getUsedPlan = () => {
    const size = collection?.results.length

    if (size <= plans[0]?.assetsNumber) return plans[0]

    for (let i = 0; i < plans.length; i++) {
      const p = plans[i]
      const nextP = plans[i + 1]

      if (!nextP) return p

      if (nextP && size > p.assetsNumber && size <= nextP.assetsNumber) {
        return nextP
      }
    }
  }

  return (
    <div className="generate-panel">
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
          generate={startGeneratingBrowser}
          setShowPayment={setShowPayment}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </AppModal>

      {/* generating modal */}
      <AppModal show={isGenerating} onHide={null} size="lg" closeButton={false}>
        <div className="text-center pb-5">
          <AppLoader />
          <div className="mt-3">
            <h5>{generatingStatus}</h5>
            <p className="paragraph">
              Please don't close your browser, this can take a few minutes
              <br /> depending on the collection size.
            </p>
          </div>
        </div>
      </AppModal>

      {/* re-generating metadata modal */}
      <AppModal
        show={isGeneratingMeta}
        onHide={null}
        size="lg"
        closeButton={false}
      >
        <div className="text-center pb-5">
          <AppLoader />
          <div className="mt-3">
            <h5>Regenerating metadata...</h5>
            <p className="paragraph">Please don't close your browser.</p>
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
          <Button theme="white" onClick={generate}>
            <MdOutlineCollections size={20} /> Generate Now
          </Button>
          <Button className="ms-3" to={`/app/${collection?.id}/gallery`}>
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

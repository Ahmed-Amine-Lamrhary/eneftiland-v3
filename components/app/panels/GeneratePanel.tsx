import { MemoryBlockStore } from "ipfs-car/blockstore/memory"
import { packToBlob } from "ipfs-car/pack/blob"
import JSZip from "jszip"
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
import {
  callApi,
  getLayersImages,
  getMetadata,
  getWatermarkCred,
  loadImage,
  showToast,
} from "../../../helpers/utils"
import { parseHistory } from "../../../services/parser"
import payMethodsType from "../../../types/payMethods"
import AppLoader from "../../AppLoader"
import AppModal from "../../AppModal"
import Button from "../../Button"
import NoDataFound from "../../NoDataFound"
import Pay from "../../payments/Pay"
import { buildStyles, CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useSession } from "next-auth/react"
import { setTimeout } from "worker-timers"

interface GeneratePanelProps {
  plans: any
  settings: any
}

const GeneratePanel = ({ plans, settings }: GeneratePanelProps) => {
  const { data: session }: any = useSession()

  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<any>(null)

  const [generatingPercentage, setGeneratingPercentage] = useState(0)
  const [generatingStatus, setGeneratingStatus] = useState("")

  // payment
  const [showPayment, setShowPayment] = useState<boolean>(false)
  const [paymentMethod, setPaymentMethod] = useState<payMethodsType>(undefined)

  //
  const [loading, setLoading] = useState(false)

  const [history, setHistory] = useState([])

  const { collection, setView, results }: any = useContext(AppContext)

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

        <div className="d-flex align-items-center">
          {!historyItem.completed && (
            <div className="d-flex align-items-center">
              <p className="error-text me-4">Error while generating</p>
            </div>
          )}

          <p className="me-3">
            {historyItem.collectionSize} token
            {historyItem.collectionSize > 1 && "s"}
          </p>

          {/* {historyItem.completed && (
            <Button
              className="btn-sm btn-outline me-3"
              onClick={() => uploadToIPFS(historyItem)}
            >
              Upload to IPFS
            </Button>
          )} */}

          <Dropdown align="end">
            <Dropdown.Toggle id="dropdown-basic">
              <BsThreeDots />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => generateAgain(historyItem)}>
                {historyItem.completed ? "Download" : "Regenerate"}
              </Dropdown.Item>

              {historyItem.completed && (
                <>
                  <Dropdown.Item onClick={() => regenerateMeta(historyItem)}>
                    Regenerate metadata
                  </Dropdown.Item>

                  {historyItem.imagesCid &&
                    historyItem.metaCid &&
                    historyItem.ipfsGateway && (
                      <>
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
                      </>
                    )}
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    )
  }

  const downloadFiles = async (nfts: any, metas: any) => {
    var zip = new JSZip()
    var imagesFolder: any = zip.folder("images")
    var metaFolder: any = zip.folder("meta")

    nfts.sort((a: any, b: any) => a.index - b.index)

    nfts.map((nft: any) => {
      imagesFolder.file(nft.name, nft.data, { base64: true })
    })

    metas.map((meta: any, index: any) => {
      metaFolder.file(
        `${index + 1}.json`,
        Buffer.from(JSON.stringify(meta, null, 4))
      )
    })
    metaFolder.file(
      `metadata.json`,
      Buffer.from(JSON.stringify(metas, null, 4))
    )

    const content = await zip.generateAsync({ type: "blob" })

    var link = document.createElement("a")
    link.href = window.URL.createObjectURL(content)
    link.download = `${collection.collectionName}.zip`
    link.click()
  }

  interface generateI {
    skipPayment?: boolean
    isWatermark?: boolean
  }

  const generate = async (options?: generateI) => {
    const { skipPayment, isWatermark } = options || {}

    if (!session?.user.lifetime && plans && plans.length > 0 && !skipPayment) {
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

    try {
      setGeneratingStatus("Generating your collection...")
      setIsGenerating(true)

      const { data } = await callApi({
        route: "me/history/create",
        body: {
          collectionId,
        },
      })

      await startGenerating({
        callback: async (nfts: any, metas: any) => {
          // download files
          await downloadFiles(nfts, metas)

          // update history
          await callApi({
            route: "me/history/update",
            body: {
              id: data.data.id,
              ipfsGateway: "",
              imagesCid: "",
              metaCid: "",
              completed: true,
            },
          })

          setGeneratingStatus("")
        },
        ...(isWatermark !== undefined && { isWatermark }),
      })
    } catch (error: any) {}
  }

  const regenerateMeta = async (history: any) => {
    setIsGenerating(true)

    const historyCollection = parseHistory(history)

    setGeneratingStatus("Regenerating metadata...")

    try {
      const metas: any = []

      let i = 0

      const func = async () => {
        if (i < historyCollection.results.length) {
          const item = historyCollection.results[i]

          // metadata
          const { metadata } = getMetadata(collection, item, i)
          metas.push(metadata)

          set()
        } else {
          // download
          var zip = new JSZip()
          var metaFolder: any = zip.folder("metadata")

          metas.map((meta: any, index: any) => {
            metaFolder.file(
              `${index + 1}.json`,
              Buffer.from(JSON.stringify(meta, null, 4))
            )
          })
          metaFolder.file(
            `metadata.json`,
            Buffer.from(JSON.stringify(metas, null, 4))
          )

          const content = await zip.generateAsync({ type: "blob" })

          var link = document.createElement("a")
          link.href = window.URL.createObjectURL(content)
          link.download = `${collection.collectionName}-metadata.zip`
          link.click()
          // download

          // update history
          await callApi({
            route: "me/history/update",
            body: {
              id: historyCollection.id,
              collectionDesc: collection.collectionDesc,
              collectionName: collection.collectionName,
              creators: JSON.stringify(collection.creators).replace(
                /(^"|"$)/g,
                ""
              ),
              externalUrl: collection.externalUrl,
              network: collection.network,
              prefix: collection.prefix,
              royalties: collection.royalties,
              symbol: collection.symbol,
            },
          })
          // update history

          setIsGenerating(false)
          await getCollectionHistory()

          setGeneratingStatus("")
          setGeneratingPercentage(0)
        }
      }

      const set = async () => {
        setTimeout(async () => {
          await func()
          i++

          if (i <= historyCollection.results.length)
            setGeneratingPercentage(
              (i * 100) / historyCollection.results.length
            )
        }, 1)
      }

      set()
    } catch (error: any) {
      console.log(error)
      showToast(error.message, "error")
    }
  }

  interface StartGeneratingI {
    isWatermark?: boolean
    otherCollection?: any
    callback?: any
  }

  const startGenerating = async (options?: StartGeneratingI) => {
    const { isWatermark, otherCollection, callback } = options || {}
    const currentPlan = getUsedPlan()

    const watermark =
      isWatermark === undefined ? currentPlan?.watermark : isWatermark

    setIsGenerating(true)
    setShowPayment(false)

    const collectionData = otherCollection ? otherCollection : collection

    try {
      const dimensions = collectionData.size

      const canvas = document.createElement("canvas")
      canvas.width = dimensions
      canvas.height = dimensions
      const ctx: any = canvas.getContext("2d")

      const allLayersImages = await getLayersImages({
        collection: collectionData,
        isHistory: otherCollection ? true : false,
      })

      // watermark
      const watermarkUrl = settings?.watermarkUrl
      const watermarkImg: any = watermarkUrl
        ? await loadImage(watermarkUrl)
        : null
      // watermark

      const nfts: any = []
      const metas: any = []

      let i = 0

      const func = async () => {
        if (i < results.length) {
          const item = results[i]

          // metadata
          const { metadata, edition } = getMetadata(collectionData, item, i)
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
              watermarkWidth: watermarkImg.width,
              watermarkHeight: watermarkImg.height,
              canvasDimensions: dimensions,
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

          set()
        } else {
          // callback
          if (callback) await callback(nfts, metas)

          setIsGenerating(false)
          setGeneratingPercentage(0)
          await getCollectionHistory()
        }
      }

      const set = async () => {
        setTimeout(async () => {
          await func()
          i++

          if (i <= results.length)
            setGeneratingPercentage((i * 100) / results.length)
        }, 1)
      }

      set()
    } catch (error: any) {
      console.log(error)
      showToast(error.message, "error")
    }
  }

  const uploadToIPFS = async (history: any) => {
    const collection = parseHistory(history)

    setGeneratingStatus("Preparing your files...")

    setIsGenerating(true)
    setShowPayment(false)
    try {
      await startGenerating({
        otherCollection: collection,
        callback: async (nfts: any, metas: any) => {
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
          const metasCid = await client.storeCar(metasCar)

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

          setGeneratingStatus("")
        },
      })
    } catch (error: any) {}
  }

  const generateAgain = async (history: any) => {
    const collection = parseHistory(history)

    setGeneratingStatus("Preparing your files...")

    setIsGenerating(true)
    setShowPayment(false)
    try {
      await startGenerating({
        otherCollection: collection,
        callback: async (nfts: any, metas: any) => {
          // download files
          await downloadFiles(nfts, metas)

          // update history
          await callApi({
            route: "me/history/update",
            body: {
              id: history.id,
              completed: true,
            },
          })

          setGeneratingStatus("")
        },
      })
    } catch (error: any) {}
  }

  const getUsedPlan = () => {
    const size = results.length

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
      {/* pay */}
      <AppModal
        show={showPayment}
        onHide={() => setShowPayment(false)}
        size="sm"
      >
        <Pay
          description={collection?.collectionName}
          currentPlan={currentPlan}
          generate={generate}
          setShowPayment={setShowPayment}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </AppModal>

      {/* generating modal */}
      <AppModal show={isGenerating} onHide={null} size="lg" closeButton={false}>
        <div className="text-center pb-5">
          <div className="app-loader">
            <div style={{ width: "80px" }}>
              <CircularProgressbar
                value={generatingPercentage}
                text={`${generatingPercentage.toFixed(0)}%`}
                styles={buildStyles({
                  pathColor: `#724bf4`,
                  textColor: "#724bf4",
                  trailColor: "#f7fbfe",
                })}
              />
            </div>
          </div>

          <div className="mt-4">
            <h5>{generatingStatus}</h5>
            <p className="paragraph">
              Please don't close your browser, this can take a few minutes
              <br /> depending on the collection size.
            </p>
          </div>
        </div>
      </AppModal>

      <div className="container">
        <div className="mb-5">
          <h3>Generate collection</h3>
          <p className="paragraph">
            Ready to generate your collection? Let’s get started!
          </p>
          <p className="paragraph">
            This will generate a tokenset based on the preview you have seen in
            the gallery.
          </p>
        </div>

        {/* generate */}
        <div className="d-flex justify-content-center mb-4">
          <Button theme="white" onClick={() => generate()}>
            <MdOutlineCollections size={20} /> Generate Now
          </Button>

          <Button
            className="ms-3"
            onClick={() => {
              router.push(
                {
                  pathname: `/app/${collection?.id}`,
                  query: { page: "gallery" },
                },
                undefined,
                { scroll: false }
              )
              setView("gallery")
            }}
          >
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

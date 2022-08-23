import { useWeb3React } from "@web3-react/core"
import axios from "axios"
import { FieldArray, Form, Formik } from "formik"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import { FiTrash2, FiUserPlus } from "react-icons/fi"
import AppContext from "../../../context/AppContext"
import { settingsSchema } from "../../../helpers/schemas"
import { showToast } from "../../../helpers/utils"
import Button from "../../Button"
import FormControl from "../../FormControl"

const FieldArrayC: any = FieldArray

const SettingsPanel = () => {
  const { active, account, activate, deactivate } = useWeb3React()

  const [loading, setLoading] = useState(false)

  const { collection, setCollection, setLayers } = useContext(AppContext)
  const router = useRouter()
  const { id }: any = router.query

  useEffect(() => {
    if (collection) setLayers(collection.layers)
  }, [account])

  const updateSettings = async (values: any) => {
    try {
      setLoading(true)

      const { data } = await axios.post("/api/me/updatecollection", {
        id,
        currentCollection: {
          ...values,
          creators: JSON.stringify(values.creators).replace(/(^"|"$)/g, ""),
        },
      })

      if (!data.success) return showToast(data.message, "error")

      setCollection({
        ...collection,
        ...values,
        creators: values.creators,
      })

      showToast(data.message, "success")
    } catch (error: any) {
      console.log(error)
      showToast(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  if (!collection) return null

  return (
    <div className="project-panel">
      <div className="container">
        <div className="row">
          <Formik
            initialValues={{
              network: collection?.network,
              collectionName: collection?.collectionName,
              collectionDesc: collection?.collectionDesc,
              collectionSize: collection?.collectionSize,
              prefix: collection?.prefix,
              size: collection?.size,

              // for solana
              symbol: collection?.symbol,
              externalUrl: collection?.externalUrl,
              royalties: collection?.royalties,
              creators: collection?.creators ? collection?.creators : [],
            }}
            validationSchema={settingsSchema}
            onSubmit={updateSettings}
          >
            {({ values }) => (
              <Form>
                <div className="">
                  {/* Network */}
                  <div className="mb-4 row">
                    <h5>Network</h5>
                    <FormControl
                      placeholder="Network"
                      type="select"
                      name="network"
                    >
                      <option value="eth">Ethereum</option>
                      <option value="sol">Solana</option>
                    </FormControl>
                  </div>

                  {/* General */}
                  <div className="mb-4 row">
                    <h5>General</h5>
                    <div className="mb-2 col-md-4">
                      <FormControl
                        placeholder="Project Name"
                        name="collectionName"
                        type="text"
                      />
                    </div>
                    <div className="mb-2 col-md-4">
                      <FormControl
                        placeholder="Project Description"
                        type="text"
                        name="collectionDesc"
                      />
                    </div>
                    <div className="mb-2 col-md-4">
                      <FormControl
                        placeholder="Collection Size"
                        type="number"
                        name="collectionSize"
                      />
                    </div>
                    {values.network === "sol" && (
                      <FormControl
                        placeholder="Symbol"
                        type="text"
                        name="symbol"
                      />
                    )}
                  </div>

                  {/* Atwork */}
                  <div className="mb-4 row">
                    <h5>Atwork</h5>
                    <div className="mb-2">
                      <FormControl
                        placeholder="Item dimensions"
                        type="number"
                        name="size"
                      />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mb-4 row">
                    <h5>Metadata</h5>
                    {values.network === "sol" && (
                      <FormControl
                        placeholder="External url"
                        type="text"
                        name="externalUrl"
                      />
                    )}

                    <FormControl
                      placeholder="Prefix"
                      type="text"
                      name="prefix"
                    />
                  </div>

                  <div className="mb-4 row">
                    {values.network === "sol" && (
                      <>
                        {/* Commission */}
                        <h5>Commission</h5>
                        <FormControl
                          placeholder="Royalties"
                          type="number"
                          name="royalties"
                        />

                        <div>
                          <label>Creators</label>
                          <FieldArrayC
                            name="creators"
                            render={(arrayHelpers: any) => (
                              <div>
                                {values.creators.map(
                                  (creator: any, index: any) => (
                                    <div key={index}>
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div
                                          className="me-3"
                                          style={{ width: "100%" }}
                                        >
                                          <FormControl
                                            hideLabel
                                            placeholder="Fee Share"
                                            type="number"
                                            name={`creators[${index}].share`}
                                          />
                                        </div>
                                        <div
                                          className="me-3"
                                          style={{ width: "100%" }}
                                        >
                                          <FormControl
                                            hideLabel
                                            placeholder="Address"
                                            type="text"
                                            name={`creators[${index}].address`}
                                          />
                                        </div>
                                        <div>
                                          <Button
                                            type="button"
                                            className="btn-sm btn-white creators-btn mb-3"
                                            onClick={() =>
                                              arrayHelpers.remove(index)
                                            }
                                          >
                                            <FiTrash2 size={18} />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}

                                <Button
                                  type="button"
                                  className="btn-sm btn-white creators-btn"
                                  onClick={() =>
                                    arrayHelpers.push({
                                      share: null,
                                      address: "",
                                    })
                                  }
                                >
                                  <FiUserPlus size={20} />{" "}
                                  <span className="ms-2">Add a creator</span>
                                </Button>
                              </div>
                            )}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Save settings */}
                  <div
                    className="text-center"
                    style={{
                      position: "sticky",
                      bottom: 0,
                      left: 0,
                      padding: 25,
                      backgroundColor: "white",
                    }}
                  >
                    <Button type="submit" loading={loading} className="btn-sm">
                      Save settings
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel

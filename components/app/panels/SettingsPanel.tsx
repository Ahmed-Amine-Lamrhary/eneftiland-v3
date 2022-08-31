import { ErrorMessage, FieldArray, Form, Formik } from "formik"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { AiFillQuestionCircle } from "react-icons/ai"
import { FiTrash2, FiUserPlus } from "react-icons/fi"
import AppContext from "../../../context/AppContext"
import { settingsSchema } from "../../../helpers/schemas"
import { callApi, getMetadataPreview, showToast } from "../../../helpers/utils"
import Button from "../../Button"
import FormControl from "../../FormControl"
import Heading from "../../Heading"
import JsonPreview from "../JsonPreview"

const Error: any = ErrorMessage
const FieldArrayC: any = FieldArray

const SettingsPanel = () => {
  const { status } = useSession()

  const [loading, setLoading] = useState(false)

  const { collection, setCollection, setLayers } = useContext(AppContext)
  const router = useRouter()
  const { id }: any = router.query

  useEffect(() => {
    if (status === "authenticated") setLayers(collection?.layers)
  }, [status])

  const updateSettings = async (values: any, submitProps: any) => {
    try {
      setLoading(true)

      const { data } = await callApi({
        route: "me/updatecollection",
        body: {
          id,
          currentCollection: {
            ...values,
            creators: JSON.stringify(values.creators).replace(/(^"|"$)/g, ""),
          },
        },
      })

      if (!data.success) return showToast(data.message, "error")

      setCollection({
        ...collection,
        ...values,
        creators: values.creators,
      })

      submitProps.resetForm({ values })

      showToast(data.message, "success")
    } catch (error: any) {
      console.log(error)
      showToast(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  if (!collection) return null

  const initialValues = {
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
  }

  return (
    <div className="project-panel">
      <div className="container-fluid">
        <Heading
          className="small"
          title="Settings"
          paragraph="Manage your collection settings."
        />

        <Formik
          initialValues={initialValues}
          validationSchema={settingsSchema}
          onSubmit={updateSettings}
        >
          {({ values, resetForm, dirty }) => (
            <Form>
              <div className="row">
                {/* form */}
                <div className="col-sm-7">
                  <div className="">
                    {/* Network */}
                    <div className="mb-4 row">
                      <h6>Network</h6>
                      <p className="mt-0 mb-3 paragraph smaller">
                        The network format for exported metadata.
                      </p>

                      <FormControl
                        hideLabel
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
                      <h6>General</h6>
                      <p className="mt-0 mb-3 paragraph smaller">
                        Manage your collections base settings.
                      </p>

                      <div className="mb-2 col-lg-4">
                        <FormControl
                          placeholder="Your Collection Name"
                          name="collectionName"
                          type="text"
                        />
                      </div>
                      <div className="mb-2 col-lg-4">
                        <FormControl
                          placeholder="Your Collection Description"
                          type="text"
                          name="collectionDesc"
                        />
                      </div>
                      <div className="mb-2 col-lg-4">
                        <FormControl
                          placeholder="Token Count"
                          type="number"
                          name="collectionSize"
                          hint="The amount of tokens the generator will create for your collection"
                        />
                      </div>
                      {values.network === "sol" && (
                        <FormControl
                          placeholder="Token Symbol"
                          type="text"
                          name="symbol"
                          hint="Usually 3 or 4 characters in length; similar to a stock market symbol."
                        />
                      )}
                    </div>

                    {/* Atwork */}
                    <div className="mb-4 row">
                      <h6>Atwork</h6>
                      <p className="mt-0 mb-3 paragraph smaller">
                        Manage how your artwork is exported.
                      </p>

                      <div className="mb-2">
                        <FormControl
                          placeholder="Item dimensions (px)"
                          type="number"
                          name="size"
                        />
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="mb-4 row">
                      <h6>Metadata</h6>
                      <p className="mt-0 mb-3 paragraph smaller">
                        Manage how your metadata is formatted.
                      </p>

                      {values.network === "sol" && (
                        <FormControl
                          placeholder="External URL"
                          type="text"
                          name="externalUrl"
                          hint="This URL will appear next to the Token's image asset and will allow users to view the Token on your site."
                        />
                      )}

                      <FormControl
                        placeholder="Token Name (prefix)"
                        type="text"
                        name="prefix"
                        hint="The naming pattern used to generate a name for each Token."
                      />
                    </div>

                    <div className="mb-4 row">
                      {values.network === "sol" && (
                        <>
                          {/* Commission */}
                          <h6>Commission</h6>
                          <p className="mt-0 mb-3 paragraph smaller">
                            Manage contract related settings.
                          </p>

                          <FormControl
                            placeholder="Royalties"
                            type="number"
                            name="royalties"
                            hint="The % of the royalties for your contract."
                          />

                          <div className="form-group">
                            <label>
                              Creators{" "}
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={(props) => (
                                  <Tooltip id="button-tooltip" {...props}>
                                    Indicate how you'd like sale proceeds to be
                                    split. For Solana exports, this will be
                                    included in your final metadata.
                                  </Tooltip>
                                )}
                              >
                                <button className="hint">
                                  <AiFillQuestionCircle />
                                </button>
                              </OverlayTrigger>
                            </label>

                            <div className="mb-3">
                              <Error name="creators">
                                {(msg: any) => (
                                  <div className="error-message">{msg}</div>
                                )}
                              </Error>
                            </div>

                            <FieldArrayC
                              name="creators"
                              render={({ remove, push, form }: any) => {
                                return (
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
                                                onClick={() => remove(index)}
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
                                      className="btn-sm btn-outline"
                                      onClick={() =>
                                        push({
                                          share: 1,
                                          address: "",
                                        })
                                      }
                                    >
                                      <FiUserPlus size={20} />{" "}
                                      <span className="ms-2">
                                        Add a creator
                                      </span>
                                    </Button>
                                  </div>
                                )
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Save settings */}
                    {dirty && (
                      <div className="save-settings">
                        <Button
                          type="submit"
                          loading={loading}
                          className="btn-sm"
                        >
                          Save Settings
                        </Button>
                        <Button
                          className="btn-sm btn-outline ms-2"
                          onClick={resetForm}
                        >
                          Discard Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* metadata preview */}
                <div className="col-sm-5">
                  <div className="sticky-panel">
                    <h6 className="mb-4">Preview metadata</h6>

                    <JsonPreview
                      json={getMetadataPreview({
                        ...collection,
                        network: values.network,
                        collectionName: values.collectionName,
                        collectionDesc: values.collectionDesc,
                        collectionSize: values.collectionSize,
                        prefix: values.prefix,
                        size: values.size,
                        symbol: values.symbol,
                        externalUrl: values.externalUrl,
                        royalties: values.royalties,
                        creators: values.creators,
                      })}
                    />
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default SettingsPanel

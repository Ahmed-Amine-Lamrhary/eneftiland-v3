import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import AppContext from "../../../context/AppContext"
import { callApi, showToast } from "../../../helpers/utils"
import RuleI from "../../../types/RuleI"
import Button from "../../Button"
import AppLoader from "../../AppLoader"
import AppSelect from "../AppSelect"
import { AiOutlineLoading, AiOutlinePlus } from "react-icons/ai"
import { RiDeleteBin5Line, RiRulerLine } from "react-icons/ri"
import NoDataFound from "../../NoDataFound"

const RulesPanel = () => {
  const { collection } = useContext(AppContext)
  const layers = collection?.layers ? [...collection?.layers] : []

  const [rules, setRules] = useState<RuleI[]>([])

  const [currentTrait1, setCurrentTrait1] = useState<string>("")
  const [currentCondition, setCurrentCondition] = useState<string>("")
  const [currentTrait2, setCurrentTrait2] = useState<string>("")

  const [loading, setLoading] = useState(false)
  const [addLoading, setAddLoading] = useState<boolean>(false)
  const [addedLoading, setAddedLoading] = useState<boolean>(false)

  const router = useRouter()
  const { id: collectionId }: any = router.query

  useEffect(() => {
    getRules()
  }, [])

  const isRuleValid = (rule: RuleI) => {
    if (!rule.trait1 || !rule.trait2 || !rule.condition) {
      showToast("Missing rule selections", "error")
      return false
    }
    return true
  }

  const getRules = async () => {
    try {
      setLoading(true)

      const { data } = await callApi({
        route: "collection/getRules",
        body: {
          collectionId,
        },
      })

      setRules(data.data)
    } catch (error: any) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const addRule = async () => {
    const newRule = {
      trait1: currentTrait1,
      condition: currentCondition,
      trait2: currentTrait2,
    }

    if (isRuleValid(newRule)) {
      try {
        setAddLoading(true)

        const { data } = await callApi({
          route: "collection/addRule",
          body: {
            collectionId,
            rule: newRule,
          },
        })

        if (!data.success) return showToast(data.message, "error")

        setRules([...rules, data.data.newRule])
        setCurrentTrait1("")
        setCurrentCondition("")
        setCurrentTrait2("")
      } catch (error: any) {
        showToast(error.message, "error")
      } finally {
        setAddLoading(false)
      }
    }
  }

  const deleteRule = async (id?: string) => {
    try {
      setAddedLoading(true)

      const { data } = await callApi({
        route: "collection/deleteRule",
        body: {
          id,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      setRules(rules.filter((rule) => rule.id !== id))
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setAddedLoading(false)
    }
  }

  const updateRule = async (newRule: RuleI, index: number) => {
    if (isRuleValid(newRule)) {
      try {
        setAddedLoading(true)

        const { data } = await callApi({
          route: "collection/updateRule",
          body: {
            rule: newRule,
          },
        })

        if (!data.success) return showToast(data.message, "error")

        const rulesClone = [...rules]
        rulesClone[index] = newRule
        setRules(rulesClone)
      } catch (error: any) {
        showToast(error.message, "error")
      } finally {
        setAddedLoading(false)
      }
    }
  }

  const traitsSelectBoxOptions: any = layers.map((layer) => {
    return {
      label: layer.name,
      options: layer.images?.map((image) => ({
        label: (
          <div>
            <img src={image.url} />
            {image.name}
          </div>
        ),
        value: `${layer.name}:${image.name}`,
      })),
    }
  })

  const traitsSelectBox = (value: any, onChange: any) => {
    const layer = value.split(":")[0]

    const selectedOption = traitsSelectBoxOptions
      ?.find((o: any) => o.label === layer)
      ?.options.find((o: any) => o.value === value)

    return (
      <AppSelect
        options={traitsSelectBoxOptions}
        value={selectedOption}
        onChange={onChange}
        placeholder="Select a trait"
      />
    )
  }

  const conditionSelectBoxOptions = [
    { value: "doesNotMixWith", label: "Doesn't mix with" },
    { value: "onlyMixesWith", label: "Only mixes with" },
  ]

  const conditionSelectBox = (value: any, onChange: any) => {
    const selectedOption = conditionSelectBoxOptions?.find(
      (o: any) => o.value === value
    )

    return (
      <AppSelect
        options={conditionSelectBoxOptions}
        value={selectedOption}
        onChange={onChange}
        isSearchable={false}
        placeholder="Condition"
      />
    )
  }

  return (
    <div className="rules-panel">
      <div className="container">
        <div className="mb-5">
          <h3>Rules</h3>
          <p className="paragraph">
            Separate traits that don’t mix well with others.
          </p>
        </div>

        {/* Create new rule */}
        <div className="mb-4">
          <h6 className="mb-3">Create new rule</h6>
          <div className="row">
            <div className="col-md-4 col-sm-6 mb-2">
              {traitsSelectBox(currentTrait1, (e: any) =>
                setCurrentTrait1(e.value)
              )}
            </div>

            <div className="col-md-3 col-sm-6 mb-2">
              {conditionSelectBox(currentCondition, (e: any) =>
                setCurrentCondition(e.value)
              )}
            </div>

            <div className="col-md-4 col-sm-6 mb-2">
              {traitsSelectBox(currentTrait2, (e: any) =>
                setCurrentTrait2(e.value)
              )}
            </div>

            <div className="col-md-1 col-sm-6 mb-2">
              <Button onClick={addRule} loading={addLoading} className="btn-sm">
                <AiOutlinePlus />
              </Button>
            </div>
          </div>
        </div>

        {/* added rules */}
        {rules?.length > 0 ? (
          <>
            <h6 className="mb-3">Rules</h6>
            {loading ? (
              <AppLoader />
            ) : (
              <>
                {rules?.map((rule, index) => (
                  <div key={index} className="row align-items-center mb-3">
                    <div className="col-md-4 col-sm-6 mb-2">
                      {traitsSelectBox(rule.trait1, (e: any) =>
                        updateRule(
                          {
                            ...rule,
                            trait1: e.value,
                          },
                          index
                        )
                      )}
                    </div>

                    <div className="col-md-3 col-sm-6 mb-2">
                      {conditionSelectBox(rule.condition, (e: any) =>
                        updateRule(
                          {
                            ...rule,
                            condition: e.value,
                          },
                          index
                        )
                      )}
                    </div>

                    <div className="col-md-4 col-sm-6 mb-2">
                      {traitsSelectBox(rule.trait2, (e: any) =>
                        updateRule(
                          {
                            ...rule,
                            trait2: e.value,
                          },
                          index
                        )
                      )}
                    </div>

                    <div className="col-md-1 col-sm-6 mb-2">
                      {addedLoading ? (
                        <AiOutlineLoading className="loading-icon" size={20} />
                      ) : (
                        <Button
                          onClick={() => deleteRule(rule.id)}
                          className="btn-sm btn-white"
                        >
                          <RiDeleteBin5Line />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <NoDataFound phrase="No rules added" Icon={RiRulerLine} />
        )}
      </div>
    </div>
  )
}

export default RulesPanel

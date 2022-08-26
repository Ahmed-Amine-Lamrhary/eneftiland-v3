import * as Yup from "yup"
import { errorMessages } from "./constants"

Yup.addMethod(
  Yup.array,
  "unique",
  function (message, mapper = (a: any) => a.name) {
    return this.test("unique", message, function (list: any) {
      return list.length === new Set(list.map(mapper)).size
    })
  }
)

const settingsSchema = Yup.object().shape({
  network: Yup.string().required(errorMessages.requiredField),
  collectionName: Yup.string().required(errorMessages.requiredField),
  collectionDesc: Yup.string().required(errorMessages.requiredField),
  collectionSize: Yup.number()
    .min(1, errorMessages.collectionSizeMin)
    .max(20000, errorMessages.collectionSizeMax)
    .required(errorMessages.requiredField),
  size: Yup.number()
    .min(5, errorMessages.sizeMin)
    .max(2400, errorMessages.sizeMax)
    .required(errorMessages.requiredField),
  prefix: Yup.string(),

  // for solana
  symbol: Yup.string(),
  externalUrl: Yup.string(),

  royalties: Yup.number().when("network", {
    is: "sol",
    then: (schema) =>
      schema
        .min(0, errorMessages.royaltiesMin)
        .max(100, errorMessages.royaltiesMax)
        .required(),
  }),
  creators: Yup.array()
    .of(
      Yup.object().shape({
        share: Yup.number(),
        address: Yup.string(),
      })
    )
    .when("network", {
      is: "sol",
      then: (schema) =>
        schema
          .test(
            "shares-validation",
            "The total number of shares must be 100%",
            (creators = []) => {
              let valid: boolean[] = []
              creators.forEach(({ share }) => {
                if (!share || share <= 0) valid.push(false)
              })

              if (valid.includes(false)) return false

              const totalShares = creators.reduce((total, creator) => {
                return total + (creator.share || 0)
              }, 0)
              return totalShares === 100
            }
          )
          .test(
            "addresses-validation",
            "Addresses are required",
            (creators = []) => {
              let valid: boolean[] = []
              creators.forEach(({ address }) => {
                if (!address) valid.push(false)
              })
              return !valid.includes(false)
            }
          ),
    }),
})

const l: any = Yup.array().of(
  Yup.object().shape({
    name: Yup.string().required(errorMessages.layerName),
    images: Yup.array().min(1, errorMessages.layerImages),
  })
)

const layersSchema = Yup.object().shape({
  layers: l.unique("Layer name must be unique").min(1, errorMessages.layers),
})

export { settingsSchema, layersSchema }

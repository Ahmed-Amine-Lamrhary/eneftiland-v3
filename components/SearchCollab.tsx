import React from "react"
import { callApi, showToast } from "../helpers/utils"
import FormControl from "./FormControl"

const SearchCollab = () => {
  const searchByEmail = async (email: any, callback: any) => {
    try {
      const { data } = await callApi({
        route: "users",
        body: {
          email,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      callback(
        data.data.map((option: any) => ({
          label: (
            <div className="collab-select-option">
              <p className="name">{option.name}</p>
              <p className="email">{option.email}</p>
            </div>
          ),
          value: option.email,
        }))
      )
    } catch (error: any) {
      showToast(error.message, "error")
    }
  }

  return (
    <div>
      <FormControl
        placeholder="Search by email"
        name="email"
        type="suggestions"
        hideLabel
        loadOptions={searchByEmail}
      />
    </div>
  )
}

export default SearchCollab

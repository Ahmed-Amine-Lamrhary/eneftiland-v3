import React from "react"
import { BsFillInboxFill } from "react-icons/bs"

interface NoDataFoundProps {
  phrase?: string
  Icon?: any
}

const NoDataFound = ({ phrase, Icon = BsFillInboxFill }: NoDataFoundProps) => {
  return (
    <div className="no-data-found">
      <Icon size={70} />
      <h6>{phrase ? phrase : "No data found"}</h6>
    </div>
  )
}

export default NoDataFound

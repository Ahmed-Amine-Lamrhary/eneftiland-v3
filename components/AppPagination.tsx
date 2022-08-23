import React, { useState } from "react"

interface AppPaginationProps {
  handlePagination: any
  numPages: number
}

const AppPagination = ({ handlePagination, numPages }: AppPaginationProps) => {
  if (numPages === 0) return null

  return (
    <div className="app-pagination">
      Page:{" "}
      <select onChange={(e) => handlePagination(e.target.value)}>
        {Array.from(Array(numPages).keys()).map((number) => {
          return (
            <>
              <option value={number + 1}>{number + 1}</option>
            </>
          )
        })}
      </select>
    </div>
  )
}

export default AppPagination

import React, { useState, useEffect } from "react"
import { formatDate, showToast } from "../helpers/utils"
import NoDataFound from "./NoDataFound"
import AppPagination from "./AppPagination"
import { CgArrowsExchange } from "react-icons/cg"

interface TransactionsTableProps {
  getTransactions: any
}

const TransactionsTable = ({ getTransactions }: TransactionsTableProps) => {
  const [active, setActive] = useState(1)
  const [count, setCount] = useState(null)
  const [transactions, setTransactions] = useState([])

  const numPages = count ? Number.parseInt((count / 10).toFixed(0)) : 0

  useEffect(() => {
    handleGetTransactions()
  }, [])

  const handleGetTransactions = async (page?: any) => {
    try {
      const data = await getTransactions(page)

      if (!data.success) return showToast(data.message, "error")

      setCount(data.count)
      setTransactions(data.data)
    } catch (error: any) {
      showToast(error.message, "error")
    }
  }

  const handlePagination = async (number: any) => {
    if (number === active || number < 1 || number > numPages) return

    await handleGetTransactions(number)

    setActive(number)
  }

  if (transactions.length === 0)
    return (
      <NoDataFound phrase="No transactions found" Icon={CgArrowsExchange} />
    )

  return (
    <>
      {count && <p className="mb-4">{count} results found</p>}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Label</th>
              <th scope="col">Amount</th>
              <th scope="col">Method</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction: any) => (
              <tr>
                <td>{transaction.id}</td>
                <td>{transaction.label}</td>
                <td>
                  {transaction.amount} {transaction.currency}
                </td>
                <td>{transaction.method}</td>
                <td>{formatDate(transaction.dateCreated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {count && (
        <AppPagination
          handlePagination={handlePagination}
          numPages={numPages}
        />
      )}
    </>
  )
}

export default TransactionsTable

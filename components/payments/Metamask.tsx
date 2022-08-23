import React, { useContext, useEffect, useState } from "react"
import { ethers } from "ethers"
import { convertToEth, showToast } from "../../helpers/utils"
import Button from "../Button"
import AppContext from "../../context/AppContext"
import { CURRENCY } from "../../helpers/constants"

interface MetamaskProps {
  amount: any
  generate: any
}

const myMetamaskAddress = process.env.NEXT_PUBLIC_METAMASK_ADDRESS || ""

const Metamask = ({ amount, generate }: MetamaskProps) => {
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState("")
  const { settings } = useContext(AppContext)

  useEffect(() => {
    connectToWallet()
  })

  const connectToWallet = async () => {
    const win: any = window

    if (!win.ethereum)
      return showToast("Please install metamask extension", "error")

    const res = await win.ethereum.request({
      method: "eth_requestAccounts",
    })

    // Setting the address
    const accountAddress = res[0]
    setAddress(accountAddress)
  }

  const handlePayment = async () => {
    try {
      const win: any = window
      const ether: any = win.ethereum
      const network = ether.networkVersion

      // network must be Mainnet
      if (network !== "1")
        return showToast("Please switch to the Mainnet network", "error")

      setLoading(true)

      const provider = new ethers.providers.Web3Provider(ether)
      const signer = provider.getSigner()

      ethers.utils.getAddress(myMetamaskAddress)

      // get amount
      const ethAmount = await convertToEth(amount, CURRENCY)

      await signer.sendTransaction({
        to: myMetamaskAddress,
        value: ethers.utils.parseEther(
          Number.parseFloat(ethAmount.toFixed(18)) + ""
        ),
      })

      await generate()
    } catch (error: any) {
      console.log(error)

      if (error.code === "UNSUPPORTED_OPERATION") return setAddress("")

      if (error.code === "INSUFFICIENT_FUNDS")
        return showToast("Insufficient funds", "error")

      if (error.code === "INVALID_ARGUMENT")
        return showToast("Receiver address is invalid", "error")

      showToast(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="metamask-payment text-center">
      {!address && (
        <Button className="btn-sm" onClick={connectToWallet}>
          Connect To Your wallet
        </Button>
      )}

      {address && (
        <Button className="btn-sm" onClick={handlePayment} loading={loading}>
          Pay now
        </Button>
      )}
    </div>
  )
}

export default Metamask

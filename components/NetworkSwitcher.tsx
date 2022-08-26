import { useWeb3React } from "@web3-react/core"
import React from "react"
import Web3 from "web3"
import { networkParams } from "../helpers/constants"
import { showToast } from "../helpers/utils"
import { SUPPORTED_NETWORKS } from "../helpers/wallet/connectors"
import AppSelect from "./app/AppSelect"

declare const window: any

const NetworkSwitcher = () => {
  const { active, account, deactivate, library } = useWeb3React()

  const switchNetwork = async (e: any) => {
    const network = e.value

    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.toHex(network) }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[Web3.utils.toHex(network)]],
          })
        } catch (error: any) {
          showToast(error.message, "error")
        }
      }
    }
  }

  return (
    <div>
      <AppSelect
        options={SUPPORTED_NETWORKS}
        value={SUPPORTED_NETWORKS?.find(
          (network: any) =>
            network.value === Number(window.ethereum.networkVersion)
        )}
        onChange={switchNetwork}
        placeholder="Switch network"
        isSearchable={false}
      />
    </div>
  )
}

export default NetworkSwitcher

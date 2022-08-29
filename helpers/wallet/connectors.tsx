import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletLinkConnector } from "@web3-react/walletlink-connector"

// Ethereum Main Network (Mainnet) => 1
// Rinkeby Test Network            => 4
// Polygon Main Network            => 137
// Mumbai Test Network             => 80001

const ethImg =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzI1MjkyRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgMjhhMTQgMTQgMCAxIDAgMC0yOCAxNCAxNCAwIDAgMCAwIDI4WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0idXJsKCNhKSIgZmlsbC1vcGFjaXR5PSIuMyIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgMjhhMTQgMTQgMCAxIDAgMC0yOCAxNCAxNCAwIDAgMCAwIDI4WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0idXJsKCNiKSIgZD0iTTguMTkgMTQuNzcgMTQgMTguMjFsNS44LTMuNDQtNS44IDguMTktNS44MS04LjE5WiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0xNCAxNi45My01LjgxLTMuNDRMMTQgNC4zNGw1LjgxIDkuMTVMMTQgMTYuOTNaIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCIgeDI9IjE0IiB5MT0iMCIgeTI9IjI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIxNCIgeDI9IjE0IiB5MT0iMTQuNzciIHkyPSIyMi45NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNmZmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iLjkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4K"
const polImg =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjODI0N0U1IiByeD0iMTQiLz48cmVjdCB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIGZpbGw9InVybCgjYSkiIGZpbGwtb3BhY2l0eT0iLjMiIHJ4PSIxNCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xOC4yOCAxMC45MmExLjA2IDEuMDYgMCAwIDAtMS4wNiAwbC0yLjQxIDEuNDItMS42NS45My0yLjQxIDEuNDNjLS4zMS4xOS0uNzIuMTktMS4wNiAwbC0xLjkyLTEuMTJhMS4wNyAxLjA3IDAgMCAxLS41My0uOXYtMi4yYTEgMSAwIDAgMSAuNTMtLjlsMS45LTEuMDhjLjMtLjE4LjctLjE4IDEuMDQgMGwxLjkgMS4wOWMuMy4xOC41Mi41Mi41Mi45djEuNDJsMS42NC0uOTZWOS41MmExIDEgMCAwIDAtLjUyLS45bC0zLjUtMi4wNGExLjA2IDEuMDYgMCAwIDAtMS4wNiAwTDYuMTMgOC42M2ExIDEgMCAwIDAtLjUzLjl2NC4xMmExIDEgMCAwIDAgLjUzLjlsMy41NiAyLjA0Yy4zMS4xOS43MS4xOSAxLjA2IDBsMi40MS0xLjQgMS42NS0uOTUgMi40MS0xLjRjLjMxLS4xOS43Mi0uMTkgMS4wNiAwbDEuODkgMS4wOWMuMy4xOC41My41Mi41My45djIuMmExIDEgMCAwIDEtLjUzLjlsLTEuOSAxLjExYy0uMy4xOS0uNy4xOS0xLjA1IDBsLTEuODktMS4wOGExLjA3IDEuMDcgMCAwIDEtLjUyLS45di0xLjQzbC0xLjY1Ljk2djEuNDNhMSAxIDAgMCAwIC41My45bDMuNTYgMi4wNGMuMzEuMTkuNzIuMTkgMS4wNiAwbDMuNTYtMi4wNGMuMzEtLjE5LjUzLS41My41My0uOXYtNC4xM2ExIDEgMCAwIDAtLjUzLS45bC0zLjYtMi4wN1oiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwIiB4Mj0iMTQiIHkxPSIwIiB5Mj0iMjgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4K"

export const SUPPORTED_NETWORKS = [
  {
    value: 1,
    label: (
      <div>
        <img src={ethImg} />
        Ethereum
      </div>
    ),
  },
  {
    value: 4,
    label: (
      <div>
        <img src={ethImg} />
        Rinkeby
      </div>
    ),
  },
  {
    value: 137,
    label: (
      <div>
        <img src={polImg} />
        Polygon
      </div>
    ),
  },
  {
    value: 80001,
    label: (
      <div>
        <img src={polImg} />
        Mumbai
      </div>
    ),
  },
]

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_NETWORKS.map((network) => network.value),
})

export const walletlink = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/c324248cc5e14a859dcc4ea1a25b0880`,
  appName: "web3-react-demo",
})
